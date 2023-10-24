import * as React from "react";
import Svg, { Path } from "react-native-svg";

const MicIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={props.style.width} height={props.style.height} {...props}>
        <Path fill="#209F8B" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" />
        <Path
            fill="#fff"
            d="M12.93 16.528c1.574-.226 3.458-1.408 3.588-3.987a.306.306 0 0 0-.093-.245.313.313 0 0 0-.236-.101h-.006a.324.324 0 0 0-.324.314c-.118 2.34-1.952 3.403-3.6 3.403-1.648 0-3.482-1.063-3.6-3.403a.33.33 0 0 0-.566-.213.355.355 0 0 0-.093.245c.13 2.579 2.015 3.76 3.588 3.987a.191.191 0 0 1 .161.195v.755h-1.542c-.33 0-.33.522 0 .522h4.005c.33 0 .33-.522 0-.522h-1.437v-.755a.185.185 0 0 1 .156-.195Z"
        />
        <Path
            fill="#fff"
            d="M12.26 14.402c1.33 0 2.418-1.094 2.418-2.446v-3.51C14.678 7.102 13.596 6 12.26 6S9.841 7.094 9.841 8.447v3.509c0 1.352 1.082 2.447 2.418 2.447Zm-1.623-2.446v-3.51c0-.905.727-1.641 1.622-1.641.896 0 1.623.736 1.623 1.642v3.509c0 .906-.727 1.642-1.623 1.642a1.633 1.633 0 0 1-1.623-1.642Z"
        />
    </Svg>
);
export default MicIcon;
