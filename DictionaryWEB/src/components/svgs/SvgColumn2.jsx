const SvgColumn2 = ({
  className,
  style,
  fill = '#AAD2E6',
  fillOpacity = 0.3,
  ...props
}) => (
  <svg
    viewBox="0 0 70 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M29 24C31.2091 24 33 25.7909 33 28V39C33 41.2091 31.2091 43 29 43H4C1.79086 43 1.61067e-08 41.2091 0 39V28C0 25.7909 1.79086 24 4 24H29ZM66 24C68.2091 24 70 25.7909 70 28V39C70 41.2091 68.2091 43 66 43H41C38.7909 43 37 41.2091 37 39V28C37 25.7909 38.7909 24 41 24H66ZM29 0C31.2091 6.44256e-08 33 1.79086 33 4V15C33 17.2091 31.2091 19 29 19H4C1.79086 19 1.61067e-08 17.2091 0 15V4C0 1.79086 1.79086 6.44256e-08 4 0H29ZM66 0C68.2091 6.44256e-08 70 1.79086 70 4V15C70 17.2091 68.2091 19 66 19H41C38.7909 19 37 17.2091 37 15V4C37 1.79086 38.7909 6.44256e-08 41 0H66Z"
      fill={fill}
      fillOpacity={fillOpacity}
    />
  </svg>
);

export default SvgColumn2;