import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const RoundedWarningIcon = (props) => (
    <Svg width={props.style.width} height={props.style.height} {...props} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
            d="M14.0003 16.6667C13.6707 16.6667 13.3485 16.7644 13.0744 16.9476C12.8003 17.1307 12.5867 17.391 12.4605 17.6955C12.3344 18.0001 12.3014 18.3352 12.3657 18.6585C12.43 18.9818 12.5887 19.2788 12.8218 19.5119C13.0549 19.745 13.3519 19.9037 13.6752 19.968C13.9985 20.0323 14.3336 19.9993 14.6381 19.8732C14.9427 19.747 15.203 19.5334 15.3861 19.2593C15.5693 18.9852 15.667 18.663 15.667 18.3334C15.667 17.8913 15.4914 17.4674 15.1788 17.1548C14.8663 16.8423 14.4424 16.6667 14.0003 16.6667V16.6667ZM14.0003 14.6667C14.354 14.6667 14.6931 14.5262 14.9431 14.2762C15.1932 14.0261 15.3337 13.687 15.3337 13.3334V9.33335C15.3337 8.97973 15.1932 8.64059 14.9431 8.39055C14.6931 8.1405 14.354 8.00002 14.0003 8.00002C13.6467 8.00002 13.3076 8.1405 13.0575 8.39055C12.8075 8.64059 12.667 8.97973 12.667 9.33335V13.3334C12.667 13.687 12.8075 14.0261 13.0575 14.2762C13.3076 14.5262 13.6467 14.6667 14.0003 14.6667ZM14.0003 0.666687C11.3632 0.666687 8.78538 1.44867 6.59273 2.91376C4.40007 4.37884 2.69111 6.46123 1.68194 8.89757C0.672769 11.3339 0.408725 14.0148 0.923194 16.6012C1.43766 19.1876 2.70754 21.5634 4.57224 23.4281C6.43694 25.2928 8.81271 26.5627 11.3991 27.0772C13.9855 27.5916 16.6664 27.3276 19.1028 26.3184C21.5391 25.3092 23.6215 23.6003 25.0866 21.4076C26.5517 19.215 27.3337 16.6371 27.3337 14C27.3297 10.465 25.9237 7.07591 23.4241 4.57627C20.9244 2.07664 17.5353 0.670618 14.0003 0.666687V0.666687ZM14.0003 24.6667C11.8907 24.6667 9.82837 24.0411 8.07425 22.869C6.32012 21.697 4.95295 20.0311 4.14562 18.082C3.33828 16.1329 3.12705 13.9882 3.53862 11.9191C3.9502 9.84993 4.9661 7.94931 6.45786 6.45755C7.94962 4.96579 9.85024 3.94989 11.9194 3.53831C13.9885 3.12674 16.1332 3.33797 18.0823 4.14531C20.0314 4.95264 21.6973 6.31981 22.8693 8.07394C24.0414 9.82806 24.667 11.8904 24.667 14C24.6638 16.828 23.5389 19.5392 21.5392 21.5389C19.5395 23.5386 16.8283 24.6635 14.0003 24.6667V24.6667Z"
            fill="#F95A59"
        />
    </Svg>
);
export default RoundedWarningIcon;
