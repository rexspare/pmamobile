import * as React from "react";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const SpanishIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "24"}
        height={props.style?.height || "24"}
        viewBox="0 0 24 24"
        {...props}>
        <G clipPath="url(#a)">
            <Path fill="#F93939" d="M-4 0h32v24H-4z" />
            <Path fill="#FFDA2C" fillRule="evenodd" d="M-4 6.4h32v11.2H-4V6.4Z" clipRule="evenodd" />
            <Path
                fill="#D4AF2C"
                fillRule="evenodd"
                d="M9.714 9.955v4.032c0 1.12-1.024 2.016-2.285 2.016H4.38C3.122 16 2.095 15.1 2.095 13.984V9.952c0-.915.683-1.68 1.622-1.928.283-.832 1.155-.086 2.188-.086 1.039 0 1.904-.741 2.188.088.936.254 1.621 1.02 1.621 1.93Z"
                clipRule="evenodd"
            />
            <Path fill="#BCC9F0" fillRule="evenodd" d="M9.714 11.2h1.524V16H9.714v-4.8Zm-9.143 0h1.524V16H.571v-4.8Z" clipRule="evenodd" />
            <Path fill="#1A47B8" fillRule="evenodd" d="M9.714 14.4h1.524V16H9.714v-1.6Zm-9.143 0h1.524V16H.571v-1.6Z" clipRule="evenodd" />
            <Path fill="#D4AF2C" fillRule="evenodd" d="M9.714 9.6h1.524v1.6H9.714V9.6Zm-9.143 0h1.524v1.6H.571V9.6Z" clipRule="evenodd" />
            <Path fill="#AF010D" fillRule="evenodd" d="M3.62 9.6h1.523V12H3.619V9.6Zm3.047 3.2H8.19v2.4H6.667v-2.4Z" clipRule="evenodd" />
            <Path fill="#AE6A3E" fillRule="evenodd" d="M6.667 9.6H8.19V12H6.667V9.6Z" clipRule="evenodd" />
            <Path fill="#FFDA2C" fillRule="evenodd" d="M3.62 12.8h1.523v2.4H3.619v-2.4Z" clipRule="evenodd" />
            <Path fill="#AF010D" fillRule="evenodd" d="M5.143 9.6 3.619 8h4.572L6.667 9.6H5.143Z" clipRule="evenodd" />
            <Path fill="#D4AF2C" fillRule="evenodd" d="M5.143 6.4h1.524V8H5.143V6.4Z" clipRule="evenodd" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Rect width={24} height={24} fill="#fff" rx={12} />
            </ClipPath>
        </Defs>
    </Svg>
);
export default SpanishIcon;
