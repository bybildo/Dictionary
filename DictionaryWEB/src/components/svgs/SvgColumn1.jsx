const SvgColumn1 = ({
  className,
  style,
  fill = '#AAD2E6',
  fillOpacity = 0.3,
  ...props
}) => (
  <svg
    viewBox="0 0 62 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M57 24C59.7614 24 62 26.2386 62 29V37C62 39.7614 59.7614 42 57 42H5C2.23858 42 1.28855e-07 39.7614 0 37V29C1.28855e-07 26.2386 2.23858 24 5 24H57ZM57 0C59.7614 0 62 2.23858 62 5V14C62 16.7614 59.7614 19 57 19H5C2.23858 19 9.66415e-08 16.7614 0 14V5C9.66416e-08 2.23858 2.23858 0 5 0H57Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
  </svg>
);

export default SvgColumn1;
