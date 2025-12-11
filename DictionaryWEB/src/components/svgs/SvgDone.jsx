const SvgDone = ({
    className,
    style,
    fill = '#AAD2E6',
    fillOpacity = 1,
    ...props
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        {...props}
    >
        <path
            d="M20.292969 5.2929688L9 16.585938L4.7070312 12.292969L3.2929688 13.707031L9 19.414062L21.707031 6.7070312L20.292969 5.2929688Z"
            fill={fill}
            fillOpacity={fillOpacity}
        />
    </svg>
);

export default SvgDone;
