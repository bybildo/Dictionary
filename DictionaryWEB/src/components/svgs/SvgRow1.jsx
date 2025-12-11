const SvgRow1 = ({
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
      d="M16 23C18.7614 23 21 25.2386 21 28V37C21 39.7614 18.7614 42 16 42H5C2.23858 42 0 39.7614 0 37V28C0 25.2386 2.23858 23 5 23H16ZM58 23C60.7614 23 63 25.2386 63 28V37C63 39.7614 60.7614 42 58 42H29C26.2386 42 24 39.7614 24 37V28C24 25.2386 26.2386 23 29 23H58ZM16 0C18.7614 0 21 2.23858 21 5V14C21 16.7614 18.7614 19 16 19H5C2.23858 19 0 16.7614 0 14V5C0 2.23858 2.23858 0 5 0H16ZM58 0C60.7614 0 63 2.23858 63 5V14C63 16.7614 60.7614 19 58 19H29C26.2386 19 24 16.7614 24 14V5C24 2.23858 26.2386 2.57711e-07 29 0H58Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
  </svg>
);

export default SvgRow1;
