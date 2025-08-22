import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { type Feed } from "../../api/types";

import React from "react";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { toast } from "react-toastify";
import { getFeed } from "../../api/feed";

const postForm = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  useEffect(() => {
    if (inputRef.current) {
      const tagify = new Tagify(inputRef.current, {
        maxTags: 30,
        placeholder: "태그를 입력하세요...",
      });

      tagify.on("change", (e) => {
        console.log("현재 태그:", e.detail.value); // JSON 문자열
        const parsedTags = JSON.parse(e.detail.value).map(
          (tag: any) => tag.value
        );
        setFeed((prev) => ({ ...prev, tagNames: parsedTags }));
      });
    }
    // setFeed((prev) => ({
    //   ...prev,
    //   tagNames: tags,
    // }));
  }, []);
  const [feed, setFeed] = useState<Feed>({
    type: "POST",
    title: "",
    userId: sessionStorage.getItem("userId")!,
    contents: "",
    thumbnail: "",
    tagNames: [],
    place: "",
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (tags) {
      setTags({
        ...tags,
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

  const handleSave = async () => {
    if (feed.contents == "") toast.error("일상을 입력해주세요.");
    try {
      const response = await getFeed(feed as Feed);
      if (response.isSuccess) {
        console.log(feed.tagNames);
        toast.success("피드가 업로드 되었습니다.");
        navigate("/home");
      } else alert(response.isSuccess);
    } catch (err) {
      toast.error("피드 업로드 실패 : " + err);
    }
  };
  return (
    <div className="box relative">
      <div>
        <div className="feed-title">일상 글1</div>
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
            name="contents"
            placeholder="나의 일상에 대해서 적어주세요."
            value={feed.contents}
            onChange={handleTextareaChange}
          />
        </div>
        <div className="feed-info-box">
          <div className="feed-subtitle text-left mt-3">해시태그</div>
          <input
            ref={inputRef}
            name="tags"
            placeholder="태그 최대 30개 입력 가능"
            className="text-left"
            onChange={handleChange}
          />
        </div>
        <div className="feed-subtitle mt-3">사람 태그</div>
        <div className="flex items-baseline">
          <div className="feed-subtitle mt-3 mr-3 ">공개 대상</div>
          <select name="공개 대상" className="!w-20 !p-1">
            <option value="all">전체</option>
            <option value="follower">팔로워</option>
          </select>
        </div>
      </div>
      <button className="feed-btn" type="submit" onClick={handleSave}>
        업로드
      </button>
    </div>
  );
};

export default postForm;
