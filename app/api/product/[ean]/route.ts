// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import { type NextRequest } from 'next/server';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import type { Product } from 'types/Product';

// fix-vim-highlight = {}

const Base = 'http://apps01.coto.com.ar/TicketMobile/Ticket';

interface Data {
  products: Product[];
  subsidiary?: {
    name: string;
    address: string;
    date: string;
    time: string;
  };
  total?: {
    perceptions: {
      name: string;
      value: number;
    }[];
    total?: number;
  };
}

async function getCotoDigitalLink(ean: string): Promise<string | undefined> {
  const url = `https://www.google.com/search?q=${encodeURIComponent(
    `site:cotodigital3.com.ar "${ean}"`,
  )}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'Accept-Language': 'es-AR,es',
    },
  });
  const text = await response.text();
  const root = parse(text);
  const links = root.querySelectorAll(
    'div[lang="es"][jscontroller] a[href^="https://www.cotodigital3.com.ar"]',
  );
  return links[0]?.attributes?.href;
}

function safeTrim(str: string | undefined): string {
  return (str || '').trim();
}

function fixImageUrl(url?: string): string {
  if (url) {
    const match = url.match(
      /https:\/\/static\.cotodigital3\.com\.ar\/sitios\/fotos\/[^/]+\/([^/]*?)\/([^/]*?)\.jpg/,
    );

    if (match) return `/api/img/${match[1]}-${match[2]}`;
  }

  return '';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { ean: string } },
) {
  const { ean } = params;
  if (!ean || Array.isArray(ean)) return Response.json({}, { status: 404 });

  const url = await getCotoDigitalLink(ean);

  if (!url) return Response.json({}, { status: 404 });

  const response = await fetch(url);
  const text = await response.text();
  const root = parse(text);
  const codes = root.querySelectorAll('.span_codigoplu');

  return Response.json(
    {
      url,
      name: safeTrim(root.querySelector('h1.product_page')?.innerText),
      code: {
        plu: safeTrim(codes?.[0]?.innerText),
        ean: safeTrim(codes?.[1]?.innerText),
      },
      img: fixImageUrl(root.querySelector('img.zoomImage1')?.attributes?.src),
      price: safeTrim(root.querySelector('.atg_store_newPrice')?.innerText),
      by_kg:
        safeTrim(
          root.querySelector('section.unit_products')?.innerText,
        ).toLowerCase() == 'en kg:',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, immutable, max-age=86400',
      },
    },
  );
}
