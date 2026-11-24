/**
 * Vercel Serverless Function: 카카오 알림톡/메시지 발송 API
 * 엔드포인트: POST /api/send-kakao
 */

module.exports = async function handler(req, res) {
  // 1. CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청(Preflight) 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed (POST 요청만 지원합니다.)'
    });
  }

  try {
    const body = req.body || {};
    const { name, phone, type, complex, budget, details } = body;

    // 2. 필수 데이터 검증
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: '고객 성함과 연락처는 필수 입력 항목입니다.'
      });
    }

    // 3. 환경변수 확인
    const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const REFRESH_TOKEN = process.env.KAKAO_REFRESH_TOKEN;
    const FRIEND_UUIDS_RAW = process.env.KAKAO_FRIEND_UUIDS;

    if (!REST_API_KEY || !REFRESH_TOKEN) {
      console.warn('카카오 API 환경변수 미설정:', {
        hasKey: Boolean(REST_API_KEY),
        hasRefreshToken: Boolean(REFRESH_TOKEN)
      });
      return res.status(500).json({
        success: false,
        message: '카카오 API 환경변수(KAKAO_REST_API_KEY, KAKAO_REFRESH_TOKEN)가 Vercel에 설정되지 않았습니다.',
        needConfig: true
      });
    }

    // 4. 카카오 Refresh Token으로 새 Access Token 발급 (매 요청 시 자동 갱신)
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: REST_API_KEY,
      refresh_token: REFRESH_TOKEN
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('카카오 Access Token 갱신 실패:', tokenData);
      return res.status(401).json({
        success: false,
        message: '카카오 Access Token 갱신에 실패했습니다. Refresh Token을 다시 확인해주세요.',
        error: tokenData
      });
    }

    const accessToken = tokenData.access_token;

    // 5. 메시지 텍스트 템플릿 구성
    const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const messageText = [
      `[도안수목토 신규 상담 접수]`,
      ``,
      `• 고객성함: ${name}`,
      `• 연락처: ${phone}`,
      `• 상담유형: ${type || '미선택'}`,
      `• 관심단지: ${complex || '미입력'}`,
      `• 예상예산: ${budget || '미입력'}`,
      ``,
      `• 세부 문의사항:`,
      `${details || '남기신 문의사항이 없습니다.'}`,
      ``,
      `접수일시: ${currentTime}`
    ].join('\n');

    const templateObject = {
      object_type: 'text',
      text: messageText,
      link: {
        web_url: 'https://sumokto-webpage.vercel.app',
        mobile_web_url: 'https://sumokto-webpage.vercel.app'
      },
      button_title: '웹사이트 바로가기'
    };

    // 6. '나에게 보내기' API 호출
    const memoUrl = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
    const memoParams = new URLSearchParams({
      template_object: JSON.stringify(templateObject)
    });

    const memoRes = await fetch(memoUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: memoParams.toString()
    });

    const memoData = await memoRes.json();

    if (!memoRes.ok || memoData.result_code !== 0) {
      console.error('카카오 나에게 보내기 실패:', memoData);
      return res.status(502).json({
        success: false,
        message: '카카오톡 메시지(나에게 보내기) 전송에 실패했습니다.',
        error: memoData
      });
    }

    // 7. '친구에게 보내기' (선택적: KAKAO_FRIEND_UUIDS 가 설정되어 있는 경우)
    let friendResult = null;
    if (FRIEND_UUIDS_RAW) {
      const uuids = FRIEND_UUIDS_RAW.split(',')
        .map(u => u.trim())
        .filter(Boolean);

      if (uuids.length > 0) {
        try {
          const friendUrl = 'https://kapi.kakao.com/v1/api/talk/friends/message/default/send';
          const friendParams = new URLSearchParams({
            receiver_uuids: JSON.stringify(uuids),
            template_object: JSON.stringify(templateObject)
          });

          const friendRes = await fetch(friendUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: friendParams.toString()
          });

          friendResult = await friendRes.json();
          console.log('친구에게 보내기 결과:', friendResult);
        } catch (friendErr) {
          console.warn('친구에게 보내기 중 오류 발생:', friendErr);
        }
      }
    }

    // 8. 성공 응답
    return res.status(200).json({
      success: true,
      message: '담당자 카카오톡으로 신규 상담 알림 메시지가 성공적으로 전송되었습니다.',
      friendResult: friendResult
    });

  } catch (error) {
    console.error('카카오 알림 발송 서버리스 함수 오류:', error);
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류로 카카오톡 전송에 실패했습니다.',
      error: error.message
    });
  }
};
