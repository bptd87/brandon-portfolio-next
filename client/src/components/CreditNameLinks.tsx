"use client";

import { Fragment } from "react";
import { getLocalCollaboratorPortfolioUrlByName } from "@shared/localStudio";

const CREDIT_NAME_SEPARATOR = /(\s+(?:and|&)\s+|,\s*)/g;

function splitCreditNames(value: string) {
  return value.split(CREDIT_NAME_SEPARATOR).filter(Boolean);
}

export function CreditNameLinks({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const segments = splitCreditNames(name);

  return (
    <>
      {segments.map((segment, index) => {
        const isSeparator = CREDIT_NAME_SEPARATOR.test(segment);
        CREDIT_NAME_SEPARATOR.lastIndex = 0;

        if (isSeparator) {
          return <Fragment key={`${segment}-${index}`}>{segment}</Fragment>;
        }

        const href = getLocalCollaboratorPortfolioUrlByName(segment);

        if (!href) {
          return <Fragment key={`${segment}-${index}`}>{segment}</Fragment>;
        }

        return (
          <a
            key={`${segment}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {segment}
          </a>
        );
      })}
    </>
  );
}
