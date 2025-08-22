import { useState } from "react";
import { toast } from "react-toastify";
import { type Feed } from "../../api/types";
import { getFeed } from "../../api/feed";
import { useNavigate } from "react-router-dom";

const feedForm = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState<Feed>({
    title: "",
    type: "POST",
    userId: sessionStorage.getItem("userId")!,
    contents: "",
    thumbnail: "",
    place: "",
    tagNames: [],
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

  //저장버튼
  const handleSave = async () => {
    if (feed.title === "") toast.error("글 제목을 입력해주세요.");
    else if (feed.price === 0) toast.error("가격을 입력해주세요.");
    else if (feed.contents === "") toast.error("물건 설명을 입력해주세요.");
    else {
      try {
        const response = await getFeed(feed as Feed);
        if (response.isSuccess) {
          toast.success("판매 게시글이 업로드 되었습니다.");
          navigate("/home");
        } else alert(response.isSuccess);
      } catch (err) {
        toast.error("판매 게시글 업로드 실패 :" + err);
      }
    }
  };
  return (
    <div className="box relative">
      <div>
        <div className="feed-title">물건 팔기</div>
        <div className="feed-subtitle">
          사용하지 않는 좋은 물건을 근처 이웃에게 판매해보세요!
        </div>
      </div>
      <div>
        <div className="flex h-20 mt-3 mb-3">
          <img src="https://placehold.co/500x500.png" />
        </div>
        <div className="feed-info-box">
          <div className="feed-subtitle">글 제목</div>
          <input
            name="title"
            className="feed-info"
            type="text"
            placeholder="글 제목"
            value={feed.title}
            onChange={handleChange}
          />
          <div className="feed-subtitle">가격</div>
          <input
            name="price"
            value={feed.price}
            className="feed-info"
            type="number"
            placeholder="가격을 입력해주세요."
            onChange={handleChange}
          />
          <div className="feed-subtitle">물건 설명</div>
          <textarea
            name="contents"
            value={feed.contents}
            className="feed-info"
            rows={5}
            placeholder="물건에 대해서 설명해주세요."
            onChange={handleTextareaChange}
          />
        </div>
        <div className="feed-subtitle text-left">거래 희망 장소</div>
        <div className="text-left">위치 추가 - 클릭 시 지도 api</div>
      </div>
      <button className="feed-btn" type="submit" onClick={handleSave}>
        업로드
      </button>
    </div>
  );
};
export default feedForm;
