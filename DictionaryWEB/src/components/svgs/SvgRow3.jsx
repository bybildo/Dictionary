const SvgRow3 = ({
  className,
  style,
  fill = '#AAD2E6',
  fillOpacity = 0.3,
  ...props
}) => (
  <svg
    viewBox="0 0 63 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M34 23C36.7614 23 39 25.2386 39 28V37C39 39.7614 36.7614 42 34 42H5C2.23858 42 0 39.7614 0 37V28C0 25.2386 2.23858 23 5 23H34ZM58 23C60.7614 23 63 25.2386 63 28V37C63 39.7614 60.7614 42 58 42H47C44.2386 42 42 39.7614 42 37V28C42 25.2386 44.2386 23 47 23H58ZM34 0C36.7614 0 39 2.23858 39 5V14C39 16.7614 36.7614 19 34 19H5C2.23858 19 0 16.7614 0 14V5C0 2.23858 2.23858 2.57711e-07 5 0H34ZM58 0C60.7614 0 63 2.23858 63 5V14C63 16.7614 60.7614 19 58 19H47C44.2386 19 42 16.7614 42 14V5C42 2.23858 44.2386 0 47 0H58Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
  </svg>
);

export default SvgRow3;