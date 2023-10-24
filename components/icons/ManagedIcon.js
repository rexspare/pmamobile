import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ManagedIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" width={props.style.width} height={props.style.height} {...props}>
        <Path
            fill="#2BD88F"
            d="m10.507 5.649-3.432 3.44-1.32-1.32a.8.8 0 1 0-1.128 1.128l1.88 1.888a.8.8 0 0 0 1.128 0l4-4a.8.8 0 1 0-1.128-1.136ZM8.33.217a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.4a6.4 6.4 0 1 1 0-12.8 6.4 6.4 0 0 1 0 12.8Z"
        />
    </Svg>
);
export default ManagedIcon;
