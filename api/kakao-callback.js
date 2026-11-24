// /api/kakao-callback.js
// 도안수목토 재벌부동산 카카오 무료 알림톡 연동 - 최초 1회 Refresh Token 발급 헬퍼

module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code, error, error_description } = req.query || {};
  const restApiKey = process.env.KAKAO_REST_API_KEY || '';
  const redirectUri = 'https://sumokto-webpage.vercel.app/api/kakao-callback';

  // 1. 에러 파라미터가 들어온 경우
  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>카카오 인증 오류 - 도안수목토</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #121212; color: #fff; padding: 40px; text-align: center; }
          .card { max-width: 500px; margin: 0 auto; background: #1e1e1e; padding: 30px; border-radius: 16px; border: 1px solid #ef4444; }
          h2 { color: #ef4444; margin-top: 0; }
          p { color: #9ca3af; line-height: 1.6; }
          a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #FEE500; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>❌ 카카오 인증 실패</h2>
          <p><strong>오류 코드:</strong> ${error}</p>
          <p><strong>상세 내용:</strong> ${error_description || '사용자가 인증을 취소했거나 권한이 부족합니다.'}</p>
          <a href="/api/kakao-callback">다시 시도하기</a>
        </div>
      </body>
      </html>
    `);
  }

  // 2. 인가 코드(?code=...)가 없는 경우: 카카오 로그인 및 동의 진행 화면 안내
  if (!code) {
    const authUrl = restApiKey
      ? `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=talk_message,friends`
      : '#';

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>카카오 리프레시 토큰 발급 - 도안수목토 재벌부동산</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f0f11; color: #e5e7eb; padding: 40px 20px; text-align: center; }
          .card { max-width: 560px; margin: 0 auto; background: #18181b; padding: 36px; border-radius: 20px; border: 1px solid #27272a; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: left; }
          h2 { color: #facc15; margin-top: 0; font-size: 24px; text-align: center; }
          .step { background: #27272a; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          .step-title { font-weight: bold; color: #fff; margin-bottom: 6px; }
          .btn-kakao { display: block; width: 100%; box-sizing: border-box; text-align: center; margin-top: 24px; padding: 16px; background: #FEE500; color: #191919; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 12px; transition: opacity 0.2s; }
          .btn-kakao:hover { opacity: 0.9; }
          .warn { color: #f87171; font-size: 13px; margin-top: 12px; }
          code { background: #3f3f46; padding: 2px 6px; border-radius: 4px; color: #fef08a; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>💬 카카오 알림톡 최초 연동 도구</h2>
          <p style="color: #9ca3af; text-align: center; margin-bottom: 24px;">고객 상담 접수 시 카카오톡으로 즉시 알림을 받기 위한 최초 1회 인증 도구입니다.</p>
          
          <div class="step">
            <div class="step-title">1단계: 카카오 개발자 콘솔 설정 확인</div>
            <div style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">
              • 카카오 개발자 콘솔 &gt; 카카오 로그인 &gt; Redirect URI에 아래 주소가 등록되어 있어야 합니다:<br>
              <code>${redirectUri}</code><br>
              • 동의항목에서 <strong>[카카오톡 메시지 전송(talk_message)]</strong>을 '선택 동의' 또는 '필수 동의'로 설정해 주세요.
            </div>
          </div>

          <div class="step">
            <div class="step-title">2단계: Vercel 환경변수 등록 확인</div>
            <div style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">
              • <code>KAKAO_REST_API_KEY</code>: ${restApiKey ? '<span style="color:#4ade80;">등록됨 (설정 완료)</span>' : '<span style="color:#ef4444;">미등록 (Vercel에 KAKAO_REST_API_KEY 추가 필요)</span>'}
            </div>
          </div>

          ${restApiKey ? `
            <a href="${authUrl}" class="btn-kakao">
              👉 카카오 로그인하고 Refresh Token 발급받기
            </a>
          ` : `
            <div style="background: #450a0a; border: 1px solid #b91c1c; border-radius: 10px; padding: 16px; margin-top: 20px; color: #fca5a5; font-size: 14px;">
              ⚠️ 먼저 Vercel Project Settings &gt; Environment Variables에서 <code>KAKAO_REST_API_KEY</code>를 등록하신 후 페이지를 새로고침해 주세요.
            </div>
          `}
        </div>
      </body>
      </html>
    `);
  }

  // 3. 인가 코드(?code=...)가 있는 경우: 카카오 토큰 엔드포인트 호출하여 Refresh Token 획득
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', restApiKey);
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.refresh_token) {
      return res.status(tokenRes.status || 400).send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>토큰 발급 실패 - 도안수목토</title>
          <style>
            body { font-family: sans-serif; background: #121212; color: #fff; padding: 40px; text-align: center; }
            .card { max-width: 500px; margin: 0 auto; background: #1e1e1e; padding: 30px; border-radius: 16px; border: 1px solid #ef4444; }
            pre { background: #000; padding: 12px; border-radius: 8px; color: #f87171; text-align: left; overflow-x: auto; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FEE500; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>❌ 토큰 발급 실패</h2>
            <p>카카오 인증 서버로부터 토큰을 발급받지 못했습니다.</p>
            <pre>${JSON.stringify(tokenData, null, 2)}</pre>
            <a href="/api/kakao-callback">다시 시도하기</a>
          </div>
        </body>
        </html>
      `);
    }

    const refreshToken = tokenData.refresh_token;

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>🎉 카카오 연동 완료 - 도안수목토 재벌부동산</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f0f11; color: #e5e7eb; padding: 40px 20px; text-align: center; }
          .card { max-width: 600px; margin: 0 auto; background: #18181b; padding: 36px; border-radius: 20px; border: 1px solid #22c55e; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: left; }
          h2 { color: #4ade80; margin-top: 0; font-size: 24px; text-align: center; }
          .token-box { background: #000; border: 1px solid #3f3f46; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 14px; color: #facc15; word-break: break-all; margin: 16px 0; }
          .btn-copy { display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 14px; background: #4ade80; color: #052e16; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; transition: background 0.2s; }
          .btn-copy:hover { background: #22c55e; }
          .guide { background: #27272a; border-radius: 12px; padding: 16px; margin-top: 24px; font-size: 13px; color: #a1a1aa; line-height: 1.6; }
          .guide strong { color: #fff; }
          code { background: #3f3f46; padding: 2px 6px; border-radius: 4px; color: #fef08a; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🎉 카카오 Refresh Token 발급 성공!</h2>
          <p style="color: #9ca3af; text-align: center; margin-bottom: 20px;">아래 발급된 <strong>Refresh Token</strong>을 복사하여 Vercel 환경변수에 등록해 주세요.</p>
          
          <div class="token-box" id="tokenBox">${refreshToken}</div>
          <button class="btn-copy" onclick="copyToken()">📋 Refresh Token 클립보드에 복사하기</button>

          <div class="guide">
            <strong>📌 마지막 단계 (Vercel 설정):</strong><br>
            1. Vercel 대시보드 &gt; <code>sumokto-webpage</code> 프로젝트 접속<br>
            2. <strong>Settings &gt; Environment Variables</strong> 메뉴로 이동<br>
            3. Key에 <code>KAKAO_REFRESH_TOKEN</code> 입력, Value에 위에서 복사한 토큰 붙여넣기 후 Save<br>
            4. 이제 고객이 웹페이지에서 상담을 신청하면 담당자 카카오톡으로 실시간 알림이 즉시 전송됩니다!
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="/" style="color: #facc15; text-decoration: underline; font-size: 14px;">홈페이지로 돌아가기</a>
          </div>
        </div>

        <script>
          function copyToken() {
            const token = document.getElementById('tokenBox').innerText.trim();
            navigator.clipboard.writeText(token).then(() => {
              alert('✅ KAKAO_REFRESH_TOKEN이 클립보드에 복사되었습니다! Vercel 환경변수에 붙여넣어 주세요.');
            }).catch(() => {
              prompt('아래 토큰을 직접 복사(Ctrl+C)하세요:', token);
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head><meta charset="UTF-8"><title>서버 오류</title></head>
      <body style="background:#121212;color:#fff;padding:40px;text-align:center;">
        <h2>⚠️ 서버 처리 중 오류가 발생했습니다</h2>
        <p>${err.message}</p>
        <a href="/api/kakao-callback" style="color:#FEE500;">다시 시도</a>
      </body>
      </html>
    `);
  }
};
