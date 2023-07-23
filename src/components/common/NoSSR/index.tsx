import dynamic from "next/dynamic";

const NoSSR = ({ children }: { children: React.ReactElement }) => children;

export default dynamic(() => Promise.resolve(NoSSR), {
    ssr: false,
});
