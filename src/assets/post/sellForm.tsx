import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { type PostRequestDto } from "../../api/types";
import { createPost } from "../../api/feed";
import { Camera, X, MapPin, Users, Type, DollarSign, ShoppingBag } from "lucide-react";

const SellForm = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [feed, setFeed] = useState<PostRequestDto>({
    title: "",
    type: "PRODUCT",  // 판매 게시글이므로 PRODUCT 타입
    userId: sessionStorage.getItem("userId") || "",
    contents: "",
    thumbnail: "",
    place: "",
    tagNames: [],
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

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeed(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // 공개 설정 변경 핸들러
  const handleVisibilityChange = (isPublic: boolean) => {
    console.log("🔄 [판매글] 공개 설정 변경:", isPublic ? "전체 공개" : "팔로워만");
    console.log("📊 변경 전 상태:", feed.isPublic);
    setFeed(prev => {
      const newFeed = { ...prev, isPublic };
      console.log("✅ 변경 후 상태:", newFeed.isPublic);
      return newFeed;
    });
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!feed.title?.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if ((feed.title?.trim().length || 0) > 100) {
      newErrors.title = "제목은 100자 이하로 작성해주세요.";
    }

    if (!feed.price || feed.price <= 0) {
      newErrors.price = "올바른 가격을 입력해주세요.";
    }

    if ((feed.price || 0) > 999999999) {
      newErrors.price = "가격이 너무 높습니다.";
    }

    if (!feed.contents?.trim()) {
      newErrors.contents = "상품 설명을 입력해주세요.";
    }

    if ((feed.contents?.trim().length || 0) > 2000) {
      newErrors.contents = "상품 설명은 2000자 이하로 작성해주세요.";
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
        toast.success("판매 게시글이 업로드되었습니다.");
        navigate("/home");
      } else {
        toast.error(response.message || "업로드에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "판매 게시글 업로드 실패";
      toast.error(errorMessage);
    }
  };

  // 메모리 정리
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // 디버깅: 현재 상태 확인
  console.log("📋 [판매글] 현재 isPublic 상태:", feed.isPublic);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">상품 판매</h1>
              <p className="text-text-muted text-sm">사용하지 않는 좋은 물건을 근처 이웃에게 판매해보세요!</p>
            </div>
          </div>
        </div>

        {/* 메인 폼 */}
        <div className="bg-background border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* 이미지 업로드 섹션 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-primary">상품 사진</h3>
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

          {/* 상품 정보 입력 섹션 */}
          <div className="p-6 space-y-6">
            {/* 제목 입력 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">제목</label>
              </div>
              <input
                name="title"
                value={feed.title}
                onChange={handleChange}
                placeholder="어떤 상품을 판매하시나요?"
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.title 
                    ? "border-red-500 bg-red-50" 
                    : "border-border bg-background hover:border-border-secondary"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
              <div className="flex justify-end mt-2">
                <span className="text-xs text-text-muted">
                  {feed.title?.length || 0}/100자
                </span>
              </div>
            </div>

            {/* 가격 입력 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">가격</label>
              </div>
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  value={feed.price}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full p-4 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.price 
                      ? "border-red-500 bg-red-50" 
                      : "border-border bg-background hover:border-border-secondary"
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">원</span>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-2">{errors.price}</p>
              )}
              {(feed.price || 0) > 0 && (
                <p className="text-text-muted text-sm mt-2">
                  {formatPrice(feed.price || 0)}원
                </p>
              )}
            </div>

            {/* 상품 설명 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">상품 설명</label>
              </div>
              <textarea
                name="contents"
                value={feed.contents}
                onChange={handleChange}
                placeholder="상품의 상태, 구매 시기, 사용감 등을 자세히 설명해주세요."
                rows={5}
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
                  상세한 설명일수록 구매 확률이 높아져요!
                </span>
                <span className="text-xs text-text-muted">
                  {feed.contents?.length || 0}/2000자
                </span>
              </div>
            </div>

            {/* 거래 희망 장소 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <label className="font-semibold text-text-primary">거래 희망 장소</label>
              </div>
              <input
                name="place"
                value={feed.place}
                onChange={handleChange}
                placeholder="거래를 희망하는 장소를 입력하세요"
                className="w-full p-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <p className="text-xs text-text-muted mt-2">
                안전한 거래를 위해 공공장소에서 만나는 것을 권장합니다.
              </p>
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
                판매글 올리기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellForm;