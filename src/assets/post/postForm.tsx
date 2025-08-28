import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { type PostRequestDto } from "../../api/types";
import React from "react";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { toast } from "react-toastify";
import { createPost } from "../../api/feed";
import { Camera, X, MapPin, Users, Hash, Type, MessageSquare } from "lucide-react";

const PostForm = () => {
  const navigate = useNavigate();
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [feed, setFeed] = useState<PostRequestDto>({
    type: "POST",
    title: "",
    userId: sessionStorage.getItem("userId") || "",
    contents: "",
    thumbnail: "",
    tagNames: [],
    place: "",
    price: 0,
    isPublic: true,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 이미지 선택 핸들러
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast.error("최대 5장까지 업로드 가능합니다.");
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    
    // 미리보기 URL 생성
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  // 이미지 제거 핸들러
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // 메모리 해제
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return newUrls;
    });
  };

  // Tagify 초기화
  useEffect(() => {
    if (tagInputRef.current) {
      const tagify = new Tagify(tagInputRef.current, {
        maxTags: 30,
        placeholder: "태그를 입력하세요 (최대 30개)",
        transformTag: (tagData) => {
          if (!tagData.value.startsWith("#")) {
            tagData.value = "#" + tagData.value;
          }
          return tagData;
        },
        dropdown: {
          enabled: 0,
        },
      });

      tagify.on("change", (e) => {
        interface TagData {
          value: string;
        }
        
        try {
          const parsedTags = JSON.parse(e.detail.value).map(
            (tag: TagData) => tag.value
          );
          setFeed(prev => ({ ...prev, tagNames: parsedTags }));
        } catch (error) {
          console.error("Tag parsing error:", error);
        }
      });

      return () => {
        tagify.destroy();
      };
    }
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeed(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // 공개 설정 변경 핸들러
  const handleVisibilityChange = (isPublic: boolean) => {
    setFeed(prev => ({ ...prev, isPublic }));
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!feed.contents?.trim()) {
      newErrors.contents = "내용을 입력해주세요.";
    }

    if ((feed.contents?.trim().length || 0) > 2000) {
      newErrors.contents = "내용은 2000자 이하로 작성해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await createPost(feed);
      if (response.isSuccess) {
        toast.success("피드가 업로드되었습니다.");
        navigate("/home");
      } else {
        toast.error(response.message || "업로드에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "피드 업로드 실패";
      toast.error(errorMessage);
    }
  };

  // 메모리 정리
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">일상 공유</h1>
              <p className="text-text-muted text-sm">나의 일상을 이웃들과 공유해보세요!</p>
            </div>
          </div>
        </div>

        {/* 메인 폼 */}
        <div className="bg-background border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* 이미지 업로드 섹션 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">사진 추가</h3>
              <span className="text-xs text-text-muted">({selectedImages.length}/5)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* 업로드 버튼 */}
              {selectedImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-background-secondary transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-xs text-text-muted mt-2 group-hover:text-primary transition-colors">
                    사진 추가
                  </span>
                </label>
              )}
              
              {/* 이미지 미리보기 */}
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 내용 입력 섹션 */}
          <div className="p-6 space-y-6">
            {/* 내용 입력 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">내용</label>
              </div>
              <textarea
                name="contents"
                value={feed.contents}
                onChange={handleChange}
                placeholder="무슨 일이 있었나요? 이웃들과 공유해보세요!"
                rows={4}
                className={`w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.contents 
                    ? "border-red-500 bg-red-50" 
                    : "border-border bg-background hover:border-border-secondary"
                }`}
              />
              {errors.contents && (
                <p className="text-red-500 text-sm mt-2">{errors.contents}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-text-muted">
                  {feed.contents?.length || 0}/2000자
                </span>
              </div>
            </div>

            {/* 해시태그 입력 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">해시태그</label>
              </div>
              <input
                ref={tagInputRef}
                name="tags"
                placeholder="태그를 입력하세요 (최대 30개)"
                className="w-full p-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* 위치 입력 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">위치</label>
              </div>
              <input
                name="place"
                value={feed.place}
                onChange={handleChange}
                placeholder="위치를 입력하세요 (선택사항)"
                className="w-full p-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* 공개 설정 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">공개 설정</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange(true)}
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    feed.isPublic
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-border-secondary"
                  }`}
                >
                  전체 공개
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange(false)}
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    !feed.isPublic
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-border-secondary"
                  }`}
                >
                  팔로워만
                </button>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="p-6 border-t border-border bg-background-secondary">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-3 px-4 border border-border rounded-xl font-medium text-text-secondary hover:bg-background hover:border-border-secondary transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;