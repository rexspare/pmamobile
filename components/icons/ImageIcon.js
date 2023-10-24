import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ImageIcon = (props) => (
    <Svg width={props.style?.width || "19"} height={props.style?.height || "16"} viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/Svg">
        <Path
            d="M16.6762 14.6057C15.1512 14.6057 13.6263 14.6057 12.1013 14.6057C9.57423 14.6057 7.04714 14.6057 4.52006 14.6057C3.82294 14.6057 3.1476 14.6057 2.45047 14.6057C2.14548 14.6057 1.84048 14.5404 1.60085 14.3008C1.38299 14.0611 1.36121 13.7779 1.36121 13.4729C1.36121 11.338 1.36121 9.22481 1.36121 7.08986C1.36121 5.93525 1.36121 4.78064 1.36121 3.62603C1.36121 3.27747 1.36121 2.92889 1.36121 2.58033C1.36121 2.34069 1.36121 2.10106 1.47014 1.86142C1.79692 1.25144 2.51583 1.36037 3.10403 1.36037C4.06257 1.36037 5.02114 1.36037 5.97969 1.36037C8.55034 1.36037 11.121 1.36037 13.6916 1.36037C14.5412 1.36037 15.3909 1.36037 16.2405 1.36037C16.393 1.36037 16.5237 1.36037 16.6762 1.36037C17.2208 1.38215 17.5912 1.77429 17.6129 2.31892C17.6783 4.17066 17.6129 6.04417 17.6129 7.9177C17.6129 9.83479 17.6565 11.7301 17.6129 13.6472C17.6129 14.17 17.2208 14.584 16.6762 14.6057C15.8048 14.6275 15.783 16 16.6762 15.9782C17.7872 15.9346 18.7676 15.1722 18.9419 14.0611C18.9854 13.7997 18.9854 13.5601 18.9854 13.2986C18.9854 12.3183 18.9854 11.338 18.9854 10.3576C18.9854 7.89591 18.9854 5.45598 18.9854 2.99425C18.9854 2.7764 18.9854 2.55855 18.9854 2.3407C18.9636 1.46929 18.5061 0.66324 17.7219 0.271107C17.0683 -0.0556705 16.3276 0.0096823 15.6087 0.0096823C13.147 0.0096823 10.6853 0.0096823 8.24532 0.0096823C6.30644 0.0096823 4.36758 -0.0121029 2.40691 0.0096823C1.05623 0.0096823 0.010544 1.03359 0.010544 2.40605C0.010544 3.16853 0.010544 3.95281 0.010544 4.71529C0.010544 7.28594 0.010544 9.8348 0.010544 12.4054C0.010544 13.1461 -0.076602 13.9958 0.250176 14.6929C0.642309 15.4989 1.44835 15.9782 2.34155 16C2.51583 16 2.69011 16 2.8644 16C5.15184 16 7.43928 16 9.72672 16C11.927 16 14.1055 16 16.3058 16C16.4365 16 16.5455 16 16.6762 16C17.5694 15.9782 17.5694 14.6057 16.6762 14.6057Z"
            fill={props.style?.color || "#727C94"}
        />
        <Path
            d="M1.70977 13.9524C1.68798 14.1484 1.68798 14.1702 1.70977 14.0831C1.68798 14.1702 1.62263 14.2573 1.68799 14.1266C1.73156 14.0395 1.77514 13.9524 1.8405 13.8434C1.993 13.5602 2.16726 13.277 2.34154 12.9938C2.8426 12.1442 3.36544 11.2946 3.88828 10.445C4.4547 9.50819 5.0429 8.59321 5.60932 7.65645C5.89253 7.19896 6.50252 5.82649 7.09072 6.63255C7.56999 7.2861 7.94033 8.0268 8.35424 8.70214C9.18208 10.031 9.98814 11.3817 10.816 12.7106C11.3388 13.5602 11.8617 14.4099 12.3845 15.2813C12.842 16.022 14.0402 15.3466 13.5609 14.5841C12.232 12.4056 10.8813 10.2271 9.55243 8.02679C9.22565 7.50394 8.89889 6.9811 8.5939 6.43647C8.41962 6.13148 8.24533 5.80471 7.98391 5.54329C7.52642 5.0858 6.89464 4.91152 6.26287 5.04223C5.6311 5.17294 5.23898 5.58685 4.9122 6.1097C4.324 7.04646 3.73581 8.00501 3.14761 8.96356C2.51584 9.98746 1.86227 11.0332 1.25228 12.0788C1.03443 12.4274 0.838382 12.7977 0.642315 13.1463C0.511604 13.3859 0.380888 13.6256 0.337318 13.9088C0.293747 14.2791 0.685875 14.5841 1.01265 14.5841C1.42657 14.6495 1.68798 14.3227 1.70977 13.9524Z"
            fill={props.style?.color || "#727C94"}
        />
        <Path
            d="M11.7309 12.0354C12.1231 11.4907 12.5152 10.9243 12.9073 10.3797C13.1034 10.0965 13.2777 9.81328 13.4955 9.55186C13.6916 9.31222 13.9312 9.24687 14.1709 9.37758C14.2798 9.42115 14.3669 9.59544 14.4541 9.72615C14.6066 9.98757 14.7809 10.249 14.9334 10.5104C15.4126 11.2729 15.9137 12.0572 16.393 12.8196C16.7197 13.3207 17.0247 13.8435 17.3515 14.3446C17.8308 15.0853 19.0072 14.41 18.5279 13.6475C17.7219 12.3622 16.894 11.055 16.088 9.76971C15.7394 9.2033 15.3908 8.46261 14.7591 8.15762C14.0402 7.80905 13.1252 7.93977 12.5588 8.52797C12.3409 8.74582 12.1884 9.02902 12.0141 9.26865C11.5131 9.96578 11.0338 10.6629 10.5327 11.3818C10.3149 11.6868 10.4892 12.1443 10.7724 12.3186C11.1428 12.4711 11.5131 12.3404 11.7309 12.0354Z"
            fill={props.style?.color || "#727C94"}
        />
    </Svg>
);
export default ImageIcon;
