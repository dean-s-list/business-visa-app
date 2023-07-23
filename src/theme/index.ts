import { extendTheme } from "@chakra-ui/react";
import { Raleway } from "next/font/google";

import Button from "./button";
import Link from "./link";

const raleway = Raleway({
    subsets: ["latin"],
});

const font = raleway?.style?.fontFamily;

const theme = extendTheme({
    colors: {},
    components: {
        Button,
        Link,
    },
    fonts: {
        raleway: font,
        heading: font,
        body: font,
    },
});

export default theme;
