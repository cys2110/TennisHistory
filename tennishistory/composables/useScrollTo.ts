export const useScroll = () => {
	const { scrollToAnchor } = useAnchorScroll();
	const hash: Ref<string> = ref("");
	const scroll = (to: string) => {
		hash.value = to;
		scrollToAnchor(to);
	};
	return { scroll, hash };
};