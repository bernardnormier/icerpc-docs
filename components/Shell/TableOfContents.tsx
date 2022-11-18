// Copyright (c) ZeroC, Inc. All rights reserved.

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useHeadsObserver } from '../../hooks/hooks';
import { FiEdit, FiMessageSquare } from 'react-icons/fi';

export function TableOfContents({ toc }) {
  const [headings, setHeadings] = useState([]);
  const { activeId } = useHeadsObserver(toc);

  useEffect(() => {
    const elements = toc.filter(
      (item) =>
        item.id &&
        (item.level === 2 || item.level === 3) &&
        item.title !== 'Next steps'
    );
    setHeadings(elements);
  }, [setHeadings, toc]);

  return (
    <>
      {headings.length > 1 ? (
        <nav className="toc">
          <ul className="flex column">
            <h2>On this page</h2>
            {headings.map((item) => {
              const href = `#${item.id}`;
              const active =
                typeof window !== 'undefined' && window.location.hash === href;
              return (
                <li
                  key={item.id}
                  className={[
                    active ? 'active' : undefined,
                    item.level === 3 ? 'padded' : undefined
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Link href={href} passHref>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const y =
                          document
                            .querySelector(`#${item.id}`)
                            .getBoundingClientRect().top +
                          window.pageYOffset -
                          100;
                        window.scrollTo({
                          top: y,
                          behavior: 'smooth'
                        });
                      }}
                      style={{
                        color:
                          activeId === item.id
                            ? 'var(--primary-color)'
                            : 'var(--link-color)'
                      }}
                    >
                      {item.children}
                    </a>
                  </Link>
                </li>
              );
            })}
            <br />
            <h2>More</h2>
            <ul style={{ color: 'var(--primary-color)' }}>
              <li>
                <FiEdit />
                <Link href="/docs/quick-start" passHref>
                  <a>Edit this page</a>
                </Link>
              </li>
              <li>
                <FiMessageSquare />
                <Link href="/docs/learn-more" passHref>
                  <a>GitHub Discussions</a>
                </Link>
              </li>
            </ul>
          </ul>
          <style jsx>
            {`
              nav {
                position: sticky;
                top: calc(2.5rem + var(--nav-height));
                max-height: calc(100vh - var(--nav-height));
                flex: 0 0 15rem;
                align-self: flex-start;
                margin-bottom: 1rem;
                padding: 0.25rem 0 0;
                padding-left: 1rem;
                border-left: 1px solid var(--border-color);
              }

              h2 {
                margin: 0 0 1rem 0rem;
                text-transform: uppercase;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.05em;
              }

              ul {
                margin: 0;
                padding: 0;
              }

              li {
                list-style-type: none;
                margin: 0 0 1rem 0rem;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }

              li a {
                text-decoration: none;
              }

              li a:hover,
              li.active a {
                text-decoration: none;
              }
              li.padded {
                padding-left: 0rem;
              }
              @media screen and (max-width: 1200px) {
                nav {
                  display: none;
                }
              }
            `}
          </style>
        </nav>
      ) : null}
    </>
  );
}