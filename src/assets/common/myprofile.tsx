import React, { useState, useEffect, useRef } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { getMyProfile, updateMyProfile, uploadFile } from "../../api/profile";
import { type MyProfileInfo } from "../../api/types";
import { toast } from "react-toastify";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";
registerLocale("ko", ko);
const Myprofile = () => {
  const navigate = useNavigate();
  const [myprofile, setMyprofile] = useState<MyProfileInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genderCk] = useState([
    { label: "남자", value: "MALE" },
    { label: "여자", value: "FEMALE" },
    { label: "미공개", value: "NONE" },
  ]);

  //프로필 이미지 변경
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const profileClick = () => {
    inputRef.current?.click();
  };
  
  const profileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    // 파일 크기 검증 (300MB)
    if (file.size > 300 * 1024 * 1024) {
      toast.error('파일 크기는 300MB 이하여야 합니다.');
      return;
    }
    
    setSelectedFile(file);
    const previewURL = URL.createObjectURL(file);
    setPreviewUrl(previewURL);
  };
  
  // 프로필 이미지 제거
  const removeProfileImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (myprofile) {
      setMyprofile({ ...myprofile, profileURL: "", profileThumbURL: "" });
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyProfile();
        if (response.isSuccess && response.payload) {
          setMyprofile(response.payload);
        } else {
          setError(response.message || "개인정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("개인정보 로딩 실패", err);
        setError("개인정보를 불러오는 중 실패가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  //닉네임
  const notKo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "");
    const valuelen = e.target.value;
    if (valuelen.length >= 9) {
      toast.error("닉네임은 최대 8글자까지 입력가능합니다.");
      return;
    }
    if (myprofile) {
      setMyprofile({ ...myprofile, nickname: value });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (myprofile) {
      setMyprofile({
        ...myprofile,
        [name]: value,
      });
    }
  };

  //저장버튼
  const handleSave = async () => {
    const hasKorean = /[ㄱ-하-ㅣ가-힣]/;

    if (hasKorean.test(myprofile?.nickname || "")) {
      toast.error("닉네임은 영어로만 입력해주세요.");
      return;
    }
    if (myprofile?.phoneNumber && myprofile.phoneNumber.length !== 11) {
      toast.error("숫자로만 11자리 입력해주세요.");
      return;
    }
    
    try {
      let updatedProfile = { ...myprofile } as MyProfileInfo;
      
      // 새로운 이미지가 선택된 경우 먼저 업로드
      if (selectedFile) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = await uploadFile(selectedFile, "PROFILE");
          
          if (uploadResponse.isSuccess && uploadResponse.payload) {
            // 업로드된 이미지 URL을 프로필에 적용
            updatedProfile.profileURL = uploadResponse.payload.originFileUrl;
            updatedProfile.profileThumbURL = uploadResponse.payload.outFileUrl;
          } else {
            toast.error("이미지 업로드에 실패했습니다.");
            return;
          }
        } catch (uploadError) {
          toast.error("이미지 업로드 중 오류가 발생했습니다.");
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }
      
      // 프로필 정보 업데이트
      const response = await updateMyProfile(updatedProfile);

      if (response.isSuccess) {
        setMyprofile(updatedProfile); // 로컬 상태 업데이트
        setSelectedFile(null); // 선택된 파일 초기화
        setPreviewUrl(""); // 프리뷰 URL 초기화
        toast.success("프로필이 성공적으로 수정되었습니다!");
        navigate("/profile");
      } else {
        toast.error("프로필 수정을 할 수 없습니다.");
      }
    } catch (err) {
      toast.error("프로필 수정 실패: " + err);
    }
  };

  return (
    <div className="profile-box">
      <div className="profile-header">
        <button onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
        </button>
        <div className="profile-header-text">프로필 편집</div>
      </div>

      {loading && <div>로딩 중...</div>}
      {error && <div>에러: {error}</div>}
      {!loading && !error && myprofile && (
        <div>
          <div className="profile-imgbox">
            <img
              className="profile-img mb-4 cursor-pointer border-4 border-transparent hover:border-current"
              style={{ color: "var(--color-primary)" }}
              src={previewUrl || myprofile.profileURL || "https://placehold.co/500x500.png"}
              alt="프로필 이미지"
              onClick={profileClick}
            />
            <input 
              type="file" 
              ref={inputRef} 
              onChange={profileChange} 
              accept="image/*"
              hidden 
            />
            <div className="flex justify-center -mt-1">
              <button 
                className="text-gray-500 hover:text-rose-400 transition-colors duration-200" 
                onClick={removeProfileImage}
              >
                프로필 이미지 제거
              </button>
            </div>
          </div>
          <div className="profile-myinfo">
            <div className="profile-content">
              <div className="profile-title"> 이름</div>
              <div className="profile-title"> 닉네임</div>
              <div className="profile-title"> 성별</div>
              <div className="profile-title"> 소개</div>
              <div className="profile-title"> 생일</div>
              <div className="profile-title"> 이메일</div>
              <div className="profile-title"> 전화번호</div>
            </div>
            <div className="profile-line"></div>
            <div className="profile-content">
              <input
                name="userName"
                className="profile-update"
                value={myprofile.userName}
                onChange={handleChange}
              />
              <input
                name="nickname"
                className="profile-update"
                value={myprofile.nickname}
                onChange={notKo}
              />
              <select
                className="profile-update-dropdown"
                value={myprofile?.gender || ""}
                onChange={(e) => {
                  if (myprofile) {
                    setMyprofile({ ...myprofile, gender: e.target.value });
                  }
                }}
              >
                <option value="" disabled>
                  성별을 선택하세요
                </option>
                {genderCk.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                name="profileMessage"
                type="text"
                className="profile-update w-5/6"
                value={myprofile.profileMessage}
                onChange={handleChange}
              />
              <DatePicker
                className="profile-update"
                locale="ko"
                placeholderText="생년월일을 선택하시오"
                dateFormat={"yyyy년 MM월 dd일"}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
                value={myprofile.birthDay}
                onChange={(birth: Date | null) => {
                  const formatted = birth
                    ? format(birth, "yyyy년 MM월 dd일")
                    : "";
                  if (myprofile) {
                    setMyprofile({ ...myprofile, birthDay: formatted });
                  }
                  console.log("선택한 날짜:", formatted);
                  console.log("birth", birth);
                  console.log("birthDay", myprofile?.birthDay);
                }}
                withPortal
                onKeyDown={(e) => e.preventDefault()}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex justify-between items-center px-2 py-1">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    >
                      {"<"}
                    </button>
                    <div className="flex gap-2 items-center">
                      <select
                        value={date.getFullYear()}
                        onChange={({ target: { value } }) =>
                          changeYear(Number(value))
                        }
                      >
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}년
                            </option>
                          );
                        })}
                      </select>
                      <select
                        value={date.getMonth()}
                        onChange={({ target: { value } }) =>
                          changeMonth(Number(value))
                        }
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {i + 1}월
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      {">"}
                    </button>
                  </div>
                )}
              />
              <input
                name="email"
                readOnly
                className="profile-update"
                value={myprofile.email}
              />
              <input
                name="phoneNumber"
                className="profile-update"
                value={myprofile.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="profile-setting-btn mr-4" onClick={handleSave}>
              저장
            </button>
            <button className="profile-setting-btn" onClick={goBack}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Myprofile;
