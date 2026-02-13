import styled from "styled-components";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ErrorIcon from '../../assets/icons/error-icon.svg';

// API 엔드포인트 상수
const API_ENDPOINTS = {
    VERIFY: '/api/invitation/verify',
    JOIN: '/api/invitation/join'
} as const;

// API 응답 타입 정의
interface CodeVerificationResponse {
    isValid: boolean;
    settlementId?: string;
    settlementTitle?: string;
    expirationTime?: string;
}

interface JoinResponse {
    participantId: string;
    settlementId: string;
    role: string;
    joinTime: string;
}

// 에러 타입 정의
interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// 로딩 상태 타입
type LoadingState = 'verifying' | 'joining' | null;

const InvitationCode = () => {
    const navigate = useNavigate();
    const [codes, setCodes] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<LoadingState>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 컴포넌트 언마운트 시 진행 중인 요청 취소
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleInputChange = useCallback((index: number, value: string) => {
        const filteredValue = value.replace(/[^A-Za-z0-9]/g, '');
        if (filteredValue.length > 1) return;
        
        setCodes(prev => {
            const newCodes = [...prev];
            newCodes[index] = filteredValue.toUpperCase();
            return newCodes;
        });
        setError(''); // 입력 시 에러 메시지 초기화

        if (filteredValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }, []);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
        setCodes(prev => {
            if (e.key === 'Backspace' && !prev[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            return prev;
        });
    }, []);

    // 붙여넣기 처리
    const handlePaste = useCallback((e: React.ClipboardEvent, index: number) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        
        if (pastedText.length === 6) {
            setCodes(pastedText.split(''));
            setError('');
            // 마지막 입력 필드로 포커스 이동
            inputRefs.current[5]?.focus();
        } else if (pastedText.length > 0) {
            setCodes(prev => {
                const newCodes = [...prev];
                for (let i = 0; i < Math.min(pastedText.length, 6 - index); i++) {
                    newCodes[index + i] = pastedText[i];
                }
                return newCodes;
            });
            setError('');
            // 적절한 위치로 포커스 이동
            const nextFocusIndex = Math.min(index + pastedText.length, 5);
            inputRefs.current[nextFocusIndex]?.focus();
        }
    }, []);

    // 초대코드 유효성 검증 API 호출
    const verifyInvitationCode = useCallback(async (
        code: string, 
        signal: AbortSignal
    ): Promise<CodeVerificationResponse> => {
        try {
            const response = await fetch(`${API_ENDPOINTS.VERIFY}?code=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            });
            
            if (!response.ok) {
                const errorData: ApiError = await response.json().catch(() => ({
                    message: `서버 오류가 발생했습니다. (${response.status})`,
                    status: response.status
                }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('요청이 취소되었습니다.');
            }
            console.error('코드 검증 실패:', error);
            throw error;
        }
    }, []);

    // 초대코드로 참여 API 호출
    const joinWithInvitationCode = useCallback(async (
        code: string, 
        signal: AbortSignal
    ): Promise<JoinResponse> => {
        try {
            const response = await fetch(API_ENDPOINTS.JOIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
                signal,
            });
            
            if (!response.ok) {
                const errorData: ApiError = await response.json().catch(() => ({
                    message: `서버 오류가 발생했습니다. (${response.status})`,
                    status: response.status
                }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('요청이 취소되었습니다.');
            }
            console.error('참여 실패:', error);
            throw error;
        }
    }, []);

    // 코드 제출 처리
    const handleSubmit = useCallback(async () => {
        const codeString = codes.join('');
        if (codeString.length < 6) {
            setError('참여 코드를 다시 확인해 주세요.');
            return;
        }

        // 이전 요청이 있다면 취소
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsLoading(true);
        setError('');

        try {
            // 코드 유효성 검증
            setLoadingStep('verifying');
            const verificationResult = await verifyInvitationCode(codeString, signal);
            
            if (!verificationResult.isValid) {
                setError('유효하지 않은 참여 코드입니다.');
                return;
            }

            // 유효한 코드라면 참여 진행
            setLoadingStep('joining');
            const joinResult = await joinWithInvitationCode(codeString, signal);
            
            console.log('참여 성공:', {
                participantId: joinResult.participantId,
                settlementId: joinResult.settlementId,
                role: joinResult.role,
                joinTime: joinResult.joinTime,
                settlementTitle: verificationResult.settlementTitle
            });

            // 성공 시 receiptconfirm 페이지로 이동
            navigate('/receiptconfirm');

       } catch (error) {
            console.error('처리 실패:', error);
            // 에러 발생 시 코드 리셋
            setCodes(['', '', '', '', '', '']);
            
            if (error instanceof Error) {
                // 인원 초과 에러 체크
                if (error.message.includes('초과') || error.message.includes('exceed') || error.message.includes('full')) {
                    setError('입장 가능한 인원이 초과 되었습니다.');
                } else {
                    setError('참여 코드를 다시 확인해 주세요.');
                }
            } else {
                setError('참여 코드를 다시 확인해 주세요.');
            }
            // 첫 번째 입력 필드로 포커스 이동
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
            setLoadingStep(null);
            abortControllerRef.current = null;
        }
    }, [codes, verifyInvitationCode, joinWithInvitationCode, navigator]);
    
    // 6자리 입력 완료 시 자동 제출
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const codeString = codes.join('');
        
        if (codeString.length === 6 && !isLoading) {
            // 약간의 지연을 두어 사용자가 입력을 완료할 시간을 줌
            timeoutId = setTimeout(() => {
                handleSubmit(); 
            }, 300);
        }
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [codes, isLoading, handleSubmit]);

    return (
        <InvitationCodePageLayout>
            <ContentContainer>
                <Title>참여 코드를 입력해 주세요.</Title>
                <CodeInputContainer>
                    {codes.map((code, index) => (
                        <CodeInput
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            value={code}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => handlePaste(e, index)}
                            maxLength={1}
                            type="text"
                            $filled={!!code}
                            $hasError={!!error}
                            disabled={isLoading}
                            aria-label={`참여 코드 ${index + 1}번째 자리`}
                            autoComplete="off"
                            inputMode="numeric"
                        />
                    ))}
                </CodeInputContainer>
                {error && (
                    <ErrorMessage>
                        <ErrorIconImage src={ErrorIcon} alt="오류" />
                        {error}
                    </ErrorMessage>
                )}
            </ContentContainer>
        </InvitationCodePageLayout>
    );
};

export default InvitationCode;

const InvitationCodePageLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #ffffff;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    padding-top: 210px; 
`;

const Title = styled.h1`
    font-family: "NanumSquare";
    font-size: 17px;
    font-style: normal;
    font-weight: 800;
    line-height: 130%;
    text-align: center;
    color: #000000;
    margin-bottom: 30px;
`;

const CodeInputContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
`;

const CodeInput = styled.input<{ $filled: boolean; $hasError: boolean }>`
    width: 30px;
    height: 40px;
    border-radius: 8px;
    
    border: 2px solid ${props => {
        if (props.$hasError) return '#F44336';
        return props.$filled ? '#F44336' : '#D9D9D9';
    }};
    background-color: ${props => props.$filled ? '#F44336' : '#D9D9D9'};
    color: ${props => props.$filled ? '#FFFFFF' : '#000000'};
    text-align: center;
    font-size: 16px;
    font-weight: 800;
    line-height: 130%;
    transition: all 0.2s ease;

    &:focus {
        border-color: #F44336;
        background-color: ${props => props.$filled ? '#F44336' : '#FFFFFF'};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px ${props => props.$filled ? '#F44336' : '#D9D9D9'} inset;
        -webkit-text-fill-color: ${props => props.$filled ? '#FFFFFF' : '#000000'};
    }

    /* 모바일에서 숫자 키패드 표시 */
    &[inputmode="numeric"] {
        -moz-appearance: textfield;
    }
`;

const ErrorIconImage = styled.img`
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-right: 8px;
`;

const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F44336;
    text-align: center;
    font-family: "NanumSquare";
    font-size: 12px;
    font-weight: 700;
    line-height: 130%;
`;