import { DirType } from "@/types/types";
import { FullPageWrapperContext } from "./FullPageWrapper";
import React, { Children, cloneElement, useContext, useEffect, useMemo, useState } from "react";

type FullPageSectionProps = {
  pageId: string;
  width?: string;
  height?: string;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
  dir?: DirType;
};

const FullPageSection = ({ pageId, width, height, speed, className, children, dir }: FullPageSectionProps) => {
  const [mounted, setMounted] = useState(false);
  const data = useContext(FullPageWrapperContext);

  const isWrapper = useMemo(
    () =>
      Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type && (child.type as any).displayName === "FullPageSection"
      ),
    [children]
  );

  useEffect(() => {
    if (!mounted) {
      !isWrapper && (data.current = { page: data.current.page || pageId, pages: [...data.current.pages, pageId] });
      setMounted(true);
    }
  }, [data, isWrapper, mounted, pageId]);

  return isWrapper ? (
    Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        const childElement = child as React.ReactElement<any, React.ComponentType<any>>;

        if (childElement.type && childElement.type.displayName === "FullPageSection") {
          const props: FullPageSectionProps = {
            pageId: `${pageId}-${index + 1}`,
            width,
            height,
            dir: child.props.dir || dir,
            speed,
          };
          return cloneElement(child, props);
        }
      }
      return child;
    })
  ) : (
    <section
      id={pageId}
      className={`${className} centering absolute w-full`}
      data-dir={dir}
      style={{
        width,
        height,
        transition: `${speed}ms ease-in-out`,
        top: dir === "horizontal" ? "0%" : "100%",
        left: dir === "horizontal" ? "100%" : "0%",
        transform: data.current.page === pageId ? (dir === "horizontal" ? "translateX(-100%)" : "translateY(-100%)") : undefined,
      }}
    >
      {children}
    </section>
  );
};

FullPageSection.displayName = "FullPageSection";

export default FullPageSection;
