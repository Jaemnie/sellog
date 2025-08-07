

// const FriendList = () => {
//   return (
//     <div>
//       <div className="p-10">친구찾기</div>
//     </div>
//   );
// };

// export default FriendList;

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = () => {
  <ToastContainer
    autoClose={3000}
    hideProgressBar={true}
    closeOnClick
    pauseOnHover
  />;
};

function App() {
  const notifyId = () => toast("아이디를 입력해주세요.");

  return (
    <>
      <button className="p-20" onClick={notifyId}>
        test
      </button>
    </>
  );
}

export default App;
