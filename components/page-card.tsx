import Image from "next/image";
import React from "react";
import { OnLoad } from "next/dist/shared/lib/get-img-props";

import { Card } from "@/components/ui/card";
import { ChevronDownCircle, XCircle } from "lucide-react";

interface PageCardProps {
  src: string;
  alt: string;
  onLoad?: OnLoad;
  closeBtn?: boolean;
  onClick?: () => void;
  downloadBtn?: boolean;
}

export const PageCard = ({
  src,
  alt,
  onLoad,
  closeBtn = false,
  onClick,
  downloadBtn = false,
}: PageCardProps) => {
  return (
    <Card className="relative aspect-auto max-w-[350px] ">
      <Image src={src} alt={alt} width={400} height={400} onLoad={onLoad} />

      {closeBtn && (
        <XCircle
          className="absolute -right-2 -top-2 cursor-pointer fill-white transition-colors hover:fill-blue-500"
          onClick={onClick}
        />
      )}

      {downloadBtn && (
        <ChevronDownCircle
          size={26}
          className="absolute -right-2 -top-2 cursor-pointer fill-white transition-colors hover:fill-blue-500"
          onClick={() => {
            window.open(src, "_blank");
          }}
        />
      )}
    </Card>
  );
};
