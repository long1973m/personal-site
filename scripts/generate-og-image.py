#!/usr/bin/env python3
"""
生成 PS5 风格的 OG 分享图（1200×630）与站点 favicon（128×128）
用法：python3 scripts/generate-og-image.py [domain]
  domain 可选（如 personal-site.vercel.app），提供时绘制在右下角
依赖：Pillow；输出：public/og-image.png、public/favicon.png
"""
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_OG = os.path.join(ROOT, 'public', 'og-image.png')
OUT_FAVICON = os.path.join(ROOT, 'public', 'favicon.png')

DOMAIN = sys.argv[1] if len(sys.argv) > 1 else ''


def find_cjk_font() -> str:
    candidates = [
        '/System/Library/Fonts/PingFang.ttc',
        '/System/Library/Fonts/Hiragino Sans GB.ttc',
        '/System/Library/Fonts/STHeiti Light.ttc',
        '/System/Library/Fonts/Supplemental/Songti.ttc',
        '/Library/Fonts/Arial Unicode.ttf',
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    raise SystemExit('未找到可用中文字体，请手动指定')


def hex_rgb(h: str):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def vgrad(size, stops):
    """垂直多段渐变。stops: [(pos%, '#hex'), ...]"""
    w, h = size
    img = Image.new('RGB', (1, h))
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1) * 100
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1:
                k = (t - p0) / max(p1 - p0, 1e-6)
                a, b = hex_rgb(c0), hex_rgb(c1)
                px[0, y] = tuple(int(a[j] + (b[j] - a[j]) * k) for j in range(3))
                break
    return img.resize((w, h))


def hgrad(size, stops):
    w, h = size
    img = vgrad((h, w), stops).rotate(90, expand=True)
    return img.resize((w, h))


def main():
    random.seed(42)
    font_path = find_cjk_font()
    print(f'字体: {font_path}')

    # ---- 底色：深空垂直渐变 ----
    base = vgrad((W, H), [(0, '#0a0a1a'), (48, '#140b28'), (78, '#221040'), (100, '#2c1450')])

    # ---- 光晕斑（紫/青）----
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-260, -300, 420, 260), fill=hex_rgb('#6b46c1') + (70,))
    gd.ellipse((760, 320, 1500, 900), fill=hex_rgb('#06b6d4') + (46,))
    glow = glow.filter(ImageFilter.GaussianBlur(130))
    base = Image.alpha_composite(base.convert('RGBA'), glow)

    # ---- 星星 ----
    stars = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stars)
    for _ in range(150):
        x, y = random.uniform(0, W), random.uniform(0, H * 0.82)
        r = random.uniform(0.5, 1.8)
        a = random.randint(50, 210)
        tint = random.choice([(255, 255, 255), (196, 181, 253), (103, 232, 249)])
        sd.ellipse((x - r, y - r, x + r, y + r), fill=tint + (a,))
    big = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(big)
    for _ in range(9):
        x, y = random.uniform(40, W - 40), random.uniform(20, H * 0.6)
        r = random.uniform(2.2, 3.6)
        bd.ellipse((x - r, y - r, x + r, y + r), fill=(230, 238, 255, 235))
    big = big.filter(ImageFilter.GaussianBlur(1.4))
    base = Image.alpha_composite(Image.alpha_composite(base, stars), big)

    # ---- 合成波网格地面 ----
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gr = ImageDraw.Draw(grid)
    horizon = 500
    vx, vy = W / 2, horizon - 26   # 消失点略高于地平线
    for i in range(-14, 15):
        x_bottom = vx + i * 190
        fade_top = vy + (horizon - vy) * 0.18
        gr.line([(vx, vy + 4), (x_bottom, H)], fill=(107, 70, 193, 88), width=2)
        del fade_top
    gaps = [10, 24, 44, 72, 110, 158]
    for gi, g in enumerate(gaps):
        y = horizon + g
        alpha = max(30, 120 - gi * 16)
        color = (6, 182, 212, alpha) if gi % 2 else (124, 92, 255, alpha)
        gr.line([(0, y), (W, y)], fill=color, width=2)
    gr.line([(0, horizon), (W, horizon)], fill=(6, 182, 212, 160), width=2)
    # 地平线光带
    band = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bd2 = ImageDraw.Draw(band)
    bd2.rectangle((0, horizon - 3, W, horizon + 3), fill=(103, 232, 249, 130))
    band = band.filter(ImageFilter.GaussianBlur(5))
    base = Image.alpha_composite(base, band)
    base = Image.alpha_composite(base, grid)

    draw = ImageDraw.Draw(base)

    # ---- 标题（渐变填充文字）----
    f_title = ImageFont.truetype(font_path, 108)
    title = 'Mare · 二度空间'
    tx, ty = 84, 132
    tmp = Image.new('L', (W, 220), 0)
    td = ImageDraw.Draw(tmp)
    td.text((0, 0), title, font=f_title, fill=255)
    bb = tmp.getbbox()
    grad_strip = hgrad((bb[2] - bb[0], bb[3] - bb[1]),
                       [(0, '#67e8f9'), (55, '#a5b4fc'), (100, '#e879f9')])
    # 标题柔光投影
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh_mask = Image.new('L', (W, H), 0)
    sh_mask.paste(tmp.crop(bb), (tx + bb[0] + 3, ty + bb[1] + 4))
    shadow.paste((10, 6, 24, 200), (0, 0), sh_mask.filter(ImageFilter.GaussianBlur(6)))
    base = Image.alpha_composite(base, shadow)
    base.paste(grad_strip, (tx + bb[0], ty + bb[1]), tmp.crop(bb))

    # ⚠️ alpha_composite 返回新对象，必须重新绑定 Draw
    draw = ImageDraw.Draw(base)

    # ---- 副标题与简介 ----
    f_sub = ImageFont.truetype(font_path, 34)
    f_body = ImageFont.truetype(font_path, 26)
    sub_y = ty + (bb[3] - bb[1]) + 34
    draw.text((tx, sub_y), '个人主页 · 用 AI 解决真实业务问题', font=f_sub, fill=hex_rgb('#e5e7eb'))
    draw.text((tx, sub_y + 56),
              'AI 产品方案设计 × 竞品与行业分析 × 数据工程实践 —— 案例全部脱敏，方法论可直接抄作业',
              font=f_body, fill=hex_rgb('#9ca3af'))

    # ---- 信息 chips ----
    chips = ['5 个深度案例', '15 篇知识笔记', 'AI × 数据分析']
    f_chip = ImageFont.truetype(font_path, 24)
    cx, cy = tx, sub_y + 128
    for label in chips:
        tw = draw.textlength(label, font=f_chip)
        pad_x, chip_h = 22, 46
        draw.rounded_rectangle((cx, cy, cx + tw + pad_x * 2, cy + chip_h),
                               radius=chip_h // 2,
                               fill=(107, 70, 193, 36), outline=(103, 232, 249, 130), width=2)
        draw.text((cx + pad_x, cy + (chip_h - 24) // 2 - 4), label, font=f_chip, fill=hex_rgb('#a5f3fc'))
        cx += tw + pad_x * 2 + 18

    # ---- 域名角标 ----
    if DOMAIN:
        f_dom = ImageFont.truetype(font_path, 24)
        dom_text = DOMAIN if '/' in DOMAIN else f'{DOMAIN}'
        dw = draw.textlength(dom_text, font=f_dom)
        draw.text((W - dw - 60, H - 58), dom_text, font=f_dom, fill=hex_rgb('#94a3b8'))

    base.convert('RGB').save(OUT_OG, 'PNG', optimize=True)
    print(f'✓ {OUT_OG}')

    # ---- favicon：圆角深色底 + 渐变 M ----
    S = 128
    fav = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fav)
    fd.rounded_rectangle((4, 4, S - 4, S - 4), radius=30,
                         fill=hex_rgb('#12102b'), outline=(107, 70, 193, 200), width=3)
    fm = ImageFont.truetype(font_path, 76)
    m_mask = Image.new('L', (S, S), 0)
    md = ImageDraw.Draw(m_mask)
    md.text((S / 2, S / 2 - 4), 'M', font=fm, fill=255, anchor='mm')
    mg = hgrad((S, S), [(0, '#67e8f9'), (100, '#e879f9')])
    fav.paste(mg, (0, 0), m_mask)
    fav.save(OUT_FAVICON, 'PNG')
    print(f'✓ {OUT_FAVICON}')


if __name__ == '__main__':
    main()
