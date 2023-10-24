import * as React from "react";
import Svg, { Path } from "react-native-svg";

const TranslateIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "20"}
        height={props.style?.height || "20"}
        viewBox="0 0 20 20"
        {...props}>
        <Path
            fill={props.style?.color || "#727C94"}
            d="m9.896 18.333 3.77-10h1.71l3.874 10h-1.812l-.854-2.625h-4l-.98 2.625H9.896Zm3.146-4.083H16l-1.458-4.042H14.5l-1.458 4.042Zm-9.709 1.583-1.145-1.146 4.25-4.25A18.28 18.28 0 0 1 5.03 8.595c-.41-.618-.767-1.26-1.072-1.927H5.77c.236.458.497.892.781 1.302.285.41.608.83.969 1.26a11.269 11.269 0 0 0 1.563-2.031c.416-.701.77-1.434 1.062-2.198H.833V3.333h5.834V1.667h1.667v1.666h5.833V5h-2.354c-.306.958-.712 1.9-1.22 2.823a14.564 14.564 0 0 1-1.864 2.635l2.042 2.063-.625 1.687L7.5 11.667l-4.167 4.166Z"
        />
    </Svg>
);
export default TranslateIcon;
