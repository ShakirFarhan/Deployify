import { memo, SVGProps } from 'react';

const Ellipse2Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 1619 1619"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={809.5} cy={809.5} r={809.5} fill="url(#paint0_radial_23_18)" />
    <defs>
      <radialGradient
        id="paint0_radial_23_18"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(810.032 211.406) rotate(90) scale(808.316)"
      >
        <stop stopColor="#0C0613" />
        <stop offset={1} stopColor="#2A1745" />
      </radialGradient>
    </defs>
  </svg>
);

const Memo = memo(Ellipse2Icon);
export { Memo as Ellipse2Icon };
