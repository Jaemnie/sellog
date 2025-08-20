import { useState } from "react";

import { type Feed } from "../../api/types";

const postForm = () => {
  const [feed, setFeed] = useState<Feed>({
    type: "POST",
    title: "",
    userId: sessionStorage.getItem("userId"),
    contents: "",
    thumbnail: "",
    tagNames: [],
    place: "",
    price: 0,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (feed) {
      setFeed({
        ...feed,
        [name]: value,
      });
    }
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (feed) {
      setFeed({
        ...feed,
        [name]: value,
      });
    }
  };
  const handleSave = async () => {};
  return (
    <div className="box relative">
      <div>
        <div className="feed-title">일상 글</div>
        <div className="feed-subtitle">나의 일상을 이웃들과 공유해보세요!</div>
      </div>
      <div>
        <div className="flex h-20 mt-3 mb-3">
          <img src="https://placehold.co/500x500.png" />
        </div>
        <div className="feed-info-box">
          <div className="feed-subtitle">일상</div>
          <textarea
            className="feed-info"
            rows={5}
            name="일상 설명"
            placeholder="나의 일상에 대해서 적어주세요."
          />
        </div>
        <div className="feed-info-box">
          <div className="feed-subtitle text-left mt-3">해시태그</div>
          <textarea className="feed-info" placeholder="해시태그" />
        </div>
        <div className="feed-subtitle mt-3">사람 태그</div>
        <div>
          <div className="feed-subtitle mt-3 mr-3">공개 대상</div>
          <select name="공개 대상" className="!w-20 !p-1">
            <option value="all">전체</option>
            <option value="follower">팔로워</option>
          </select>
        </div>
      </div>
      <button className="feed-btn" type="submit" onClick={handleSave}>
        작성 완료
      </button>
    </div>
  );
};

export default postForm;
