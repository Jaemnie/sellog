import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
const Navigation: React.FC = () => {
  const [searchBtn, setSearchBtn] = useState(false);
  //   const searchClick = () => {
  //     setSearchBtn(true);
  //   //   };
  //   const toggle = () => setSearchBtn(!searchBtn);
  return (
    <div className={searchBtn ? "hidden" : ""}>
      <div
        className="absolute w-1/5 h-screen border-r-1 hidden"
        style={{ color: "var(--color-primary-light)" }}
      >
        <div
          className="text-2xl text-left p-7"
          onClick={() => setSearchBtn(!searchBtn)}
        >
          <span>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>

          <span id="search">검색</span>
        </div>
      </div>
      <div className="absolute flex ">
        <div className="w-16 h-screen border-r-1 border-slate-100 text-xl p-2">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <div className="border-r-1 rounded-2xl border-slate-300 w-80">
          <div className="text-left text-2xl font-bold p-4">검색</div>
          <div>
            <input
              type="search"
              className="m-2 p-2 bg-gray-100 rounded-lg w-64"
              placeholder="검색"
            />
            <button>
              <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
            </button>
          </div>
          <div
            className="border mb-2"
            style={{ color: "var(--color-border)" }}
          ></div>
          <div>
            <div className="flex ml-2 mr-2 justify-between">
              <div>최근 검색 항목</div>
              <button>모두 지우기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navigation;
