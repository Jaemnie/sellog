import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { getMyProfile, updateMyProfile } from "../../api/profile";
import { type MyProfileInfo } from "../../api/types";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko";
registerLocale("ko", ko);
const Myprofile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<MyProfileInfo | null>(null);
  const [profileThumbURL, setProfileThumbURL] = useState("");
  const [profileURL, setProfileURL] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [nickname, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [score, setScore] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);
  const [followedCount, setFollowedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genderCk] = useState([
    { label: "남자", value: "남자" },
    { label: "여자", value: "여자" },
    { label: "미공개", value: " 미공개" },
  ]);
  const [selectGender, setselectGender] = useState("");
  const goBack = () => {
    navigate(-1);
  };
  //const [birth, setBirth] = useState<Date | null>(null);
  const [birth, setBirth] = useState(new Date());
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyProfile();
        if (response.isSuccess && response.payload) {
          setProfileData(response.payload);
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
  useEffect(() => {
    if (profileData) {
      if (username === "") setUserName(profileData.userName || "");
      if (nickname === "") setNickName(profileData.nickname || "");
      // if (gender === "") setGender(profileData.gender || "");
      if (email === "") setEmail(profileData.email || "");
      if (profileMessage === "")
        setProfileMessage(profileData.profileMessage || "");
      if (phoneNumber === "") setPhoneNumber(profileData.phoneNumber || "");
    }
  }, [profileData]);
  const notKo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const filtered = input.replace(/[^a-zA-Z0-9]/g, "");
    setNickName(filtered);
  };
  const handleSave = async () => {
    const updatedData: MyProfileInfo = {
      userId,
      userName: username,
      nickname,
      gender,
      profileMessage,
      birthDay,
      email,
      phoneNumber,
      userAddress,
      profileThumbURL,
      profileURL,
      productCount,
      score,
      postCount,
      followCount,
      followedCount,
    };

    const response = await updateMyProfile(updatedData);
    if (response.isSuccess) {
      alert("프로필이 성공적으로 수정되었습니다!");
    } else alert("프로필 수정 실패");
  };

  return (
    <div className="profile-box">
      <div className="profile-header">
        <button onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="profile-icon" />
        </button>
        <div className="profile-header-text">프로필 편집</div>
      </div>
      <div className="profile-imgbox">
        <img
          className="profile-img mb-4"
          src={"https://placehold.co/500x500.png"}
          alt="프로필 이미지"
        />
        <div className="flex">
          <label className="cursor-pointer" htmlFor="profile-img">
            프로필 이미지 변경
          </label>
          <input id="profile-img" type="file" className="hidden" />
          <button className="ml-2">프로필 제거</button>
        </div>
      </div>
      <label className="profile-myinfo">
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
            className="profile-update"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input className="profile-update" value={nickname} onInput={notKo} />
          <select
            className="profile-update"
            value={selectGender}
            onChange={(e) => setselectGender(e.target.value)}
          >
            <option>성별을 선택하세요</option>
            {genderCk.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="profile-update w-5/6"
            value={profileMessage}
            onChange={(e) => setProfileMessage(e.target.value)}
          />
          <DatePicker
            className="profile-update"
            locale="ko"
            selected={birth}
            dateFormat={"yyyy년 MM월 dd일"}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            maxDate={new Date()}
            onChange={(date) => setBirth(date)}
            withPortal
            readOnly
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
            readOnly
            className="profile-update bg-gray-200 rounded-3xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="profile-update"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </label>
      <div className="mt-3">
        <button className="profile-setting-btn mr-4" onClick={handleSave}>
          저장
        </button>
        <button className="profile-setting-btn" onClick={goBack}>
          취소
        </button>
      </div>
    </div>
  );
};
export default Myprofile;
