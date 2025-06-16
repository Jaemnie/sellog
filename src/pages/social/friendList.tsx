import React from "react";

// const FriendList = () => {
//   return (
//     <div>
//       <div className="p-10">친구찾기</div>
//     </div>
//   );
// };

// export default FriendList;

import { toast, ToastContainer, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const notifyId = () => toast("아이디를 입력해주세요.");

  return (
    <>
      <button className="p-20" onClick={notifyId}>
        test
      </button>
      <ToastContainer
        position="top-right" // 알람 위치 지정
        autoClose={3000} // 자동 off 시간
        hideProgressBar={true} // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        rtl={false} // 알림 좌우 반전
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        pauseOnHover // 마우스를 올리면 알람 정지
        theme="light"
      />
    </>
  );
}

export default App;
