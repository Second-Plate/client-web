import { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/images/login_img.svg";
import GoogleIcon from "../assets/icons/google_icon.svg";
import { useProfileStore } from "../stores/profileStore";

const LoginPage = () => {
    const navigate = useNavigate();
    const { profile, setProfile } = useProfileStore();

    const googleLoginUrl = (() => {
        const explicitUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL as string | undefined;
        if (explicitUrl) return explicitUrl;
        const serverUrl = import.meta.env.VITE_SERVER_URL as string | undefined;
        if (!serverUrl) return "";
        return `${serverUrl.replace(/\/+$/, "")}/oauth2/authorization/google`;
    })();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (!token) return;

        const parsedUserId = Number(params.get("userId") ?? "0");
        const userId = Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : 1;
        const email = params.get("email") ?? "";
        const nickname = params.get("nickname") ?? "사용자";

        setProfile(() => ({
            userId,
            email,
            nickname,
            token,
        }));
        navigate("/home", { replace: true });
    }, [navigate, setProfile]);

    const handleLoginClick = () => {
        if (googleLoginUrl) {
            window.location.href = googleLoginUrl;
            return;
        }

        // 개발 환경 fallback: 로그인 URL이 없을 경우 홈으로 진입 가능하게 처리
        setProfile(() => ({
            userId: profile.userId || 1,
            email: profile.email || "guest@secondplate.local",
            nickname: profile.nickname || "게스트",
            token: profile.token || "dev-local-token",
        }));
        navigate("/home");
    };

    return (
        <LoginLayout>
            <ImageContainer>
                <img src={LoginImg} alt="정산 시작 이미지" />
            </ImageContainer>
            <ButtonContainer>
                <ActionButton onClick={handleLoginClick}>
                <GoogleIconImage src={GoogleIcon} alt="구글 아이콘" />
                <ButtonText>구글 계정으로 계속하기</ButtonText>
                </ActionButton>
            </ButtonContainer>
        </LoginLayout>
    );
};

export default LoginPage;

const LoginLayout = styled.div`
  background-color: #F44336;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  flex: 1;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 352px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 70px;
`;

const ActionButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  color: #F44336;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #cfb1aeff;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const GoogleIconImage = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const ButtonText = styled.span`
  color: #F44336;
  text-align: center;
  font-family: "NanumSquare", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 130%;
`;
