import { useState, useRef, useEffect } from 'react';

const useScrollCollapse = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState(false);
  const scrollRef = useRef(null);
  const titleRef = useRef(null);
  const scrollPosition = useRef(0);

  // Consolidated effect for scroll handling and state (isScrolled)
  useEffect(() => {
    const node = scrollRef.current;
    if (node && !assetsCollapsed) {
      const handleTransitionEnd = () => {
        const computedMaxHeight = window.getComputedStyle(node).maxHeight;
        if (computedMaxHeight !== '0px' && scrollPosition.current > 0) {
          node.scrollTo({
            top: scrollPosition.current,
            behavior: 'instant',
          });
        }
        node.removeEventListener('transitionend', handleTransitionEnd);
      };
      const currentMaxHeight = window.getComputedStyle(node).maxHeight;
      if (currentMaxHeight === '0px') {
        node.addEventListener('transitionend', handleTransitionEnd);
      } else if (scrollPosition.current > 0) {
        node.scrollTo({
          top: scrollPosition.current,
          behavior: 'instant',
        });
      }
      const handleScroll = () => {
        setIsScrolled(node.scrollTop > 0);
      };
      node.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => {
        node.removeEventListener('scroll', handleScroll);
        node.removeEventListener('transitionend', handleTransitionEnd);
      };
    } else if (node && assetsCollapsed) {
      const handleScroll = () => {
        setIsScrolled(node.scrollTop > 0);
      };
      node.removeEventListener('scroll', handleScroll);
    }
  }, [assetsCollapsed]);

  // Save scroll position before collapsing
  const handleAssetsCollapse = () => {
    if (scrollRef.current && !assetsCollapsed) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
    setAssetsCollapsed(!assetsCollapsed);
  };

  return {
    isScrolled,
    assetsCollapsed,
    handleAssetsCollapse,
    scrollRef,
    titleRef,
  };
};

export default useScrollCollapse; 