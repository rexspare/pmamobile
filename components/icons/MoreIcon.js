import * as React from "react";
import Svg, { Path } from "react-native-svg";

const MoreIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={props.style.width} height={props.style.height} {...props}>
        <Path fill="#209F8B" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" />
        <Path
            fill="#fff"
            d="M17.25 11.25h-4.5v-4.5a.75.75 0 1 0-1.5 0v4.5h-4.5a.75.75 0 1 0 0 1.5h4.5v4.5a.75.75 0 1 0 1.5 0v-4.5h4.5a.75.75 0 1 0 0-1.5Z"
        />
    </Svg>
);
export default MoreIcon;
