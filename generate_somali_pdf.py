#!/usr/bin/env python3
"""
Generate Somali-language PDF about NexusAI opportunity
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Colors
PRIMARY = HexColor('#059669')       # Emerald-600
PRIMARY_LIGHT = HexColor('#10B981') # Emerald-500
PRIMARY_DARK = HexColor('#047857')  # Emerald-700
DARK_BG = HexColor('#09090b')
TEXT_DARK = HexColor('#1a1a2e')
TEXT_MUTED = HexColor('#4a5568')
ACCENT = HexColor('#10B981')
WHITE = HexColor('#ffffff')
LIGHT_BG = HexColor('#f0fdf4')
BORDER_COLOR = HexColor('#d1d5db')

# Register fonts
font_dir = '/usr/share/fonts/truetype/english/'
try:
    pdfmetrics.registerFont(TTFont('Tinos', os.path.join(font_dir, 'Tinos-Regular.ttf')))
    pdfmetrics.registerFont(TTFont('Tinos-Bold', os.path.join(font_dir, 'Tinos-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('Tinos-Italic', os.path.join(font_dir, 'Tinos-Italic.ttf')))
    BODY_FONT = 'Tinos'
    HEADING_FONT = 'Tinos-Bold'
    ITALIC_FONT = 'Tinos-Italic'
except:
    BODY_FONT = 'Helvetica'
    HEADING_FONT = 'Helvetica-Bold'
    ITALIC_FONT = 'Helvetica-Oblique'

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Title'],
    fontName=HEADING_FONT,
    fontSize=28,
    leading=34,
    textColor=PRIMARY_DARK,
    alignment=TA_CENTER,
    spaceAfter=6*mm,
)

subtitle_style = ParagraphStyle(
    'CustomSubtitle',
    parent=styles['Normal'],
    fontName=ITALIC_FONT,
    fontSize=14,
    leading=20,
    textColor=TEXT_MUTED,
    alignment=TA_CENTER,
    spaceAfter=12*mm,
)

h1_style = ParagraphStyle(
    'H1',
    parent=styles['Heading1'],
    fontName=HEADING_FONT,
    fontSize=20,
    leading=26,
    textColor=PRIMARY_DARK,
    spaceBefore=12*mm,
    spaceAfter=6*mm,
    borderWidth=0,
    borderPadding=0,
)

h2_style = ParagraphStyle(
    'H2',
    parent=styles['Heading2'],
    fontName=HEADING_FONT,
    fontSize=16,
    leading=22,
    textColor=PRIMARY,
    spaceBefore=8*mm,
    spaceAfter=4*mm,
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName=BODY_FONT,
    fontSize=11,
    leading=17,
    textColor=TEXT_DARK,
    alignment=TA_JUSTIFY,
    spaceAfter=4*mm,
)

body_bold_style = ParagraphStyle(
    'BodyBold',
    parent=body_style,
    fontName=HEADING_FONT,
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=body_style,
    leftIndent=15*mm,
    firstLineIndent=-5*mm,
    spaceBefore=1*mm,
    spaceAfter=2*mm,
)

highlight_style = ParagraphStyle(
    'Highlight',
    parent=body_style,
    fontName=BODY_FONT,
    fontSize=12,
    leading=18,
    textColor=PRIMARY_DARK,
    backColor=LIGHT_BG,
    borderPadding=(8, 12, 8, 12),
    spaceBefore=4*mm,
    spaceAfter=4*mm,
)

footer_style = ParagraphStyle(
    'Footer',
    parent=styles['Normal'],
    fontName=ITALIC_FONT,
    fontSize=9,
    leading=12,
    textColor=TEXT_MUTED,
    alignment=TA_CENTER,
)

# Build document
output_path = '/home/z/my-project/download/NexusAI-Fursadda-Bilyan-Doolar-Somali.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=25*mm,
    rightMargin=25*mm,
    topMargin=25*mm,
    bottomMargin=20*mm,
)

story = []

# ==================== COVER ====================
story.append(Spacer(1, 40*mm))
story.append(Paragraph("NexusAI", title_style))
story.append(Spacer(1, 5*mm))
story.append(Paragraph("Fursadda Ganacsiga AI ee Kubadda Bilyanka Doolar", subtitle_style))
story.append(Spacer(1, 10*mm))

# Decorative line
story.append(HRFlowable(width="60%", thickness=2, color=PRIMARY, spaceAfter=10*mm, spaceBefore=5*mm, hAlign='CENTER'))

story.append(Paragraph(
    "Wargelin Loogu Talagalay Dadka Aan Ahayn Tecnologyada<br/>"
    "Si Fudud Loogu Sharaxay Saa'idka AI ee Shiinaha<br/>"
    "Iyo Sida NexusAI Inay Noqon Kartaa Shirkad Bilyan Doolar",
    ParagraphStyle('CoverDesc', parent=body_style, fontSize=13, leading=20, alignment=TA_CENTER, textColor=TEXT_MUTED)
))

story.append(Spacer(1, 20*mm))
story.append(Paragraph("May 2026", ParagraphStyle('Date', parent=body_style, fontSize=12, alignment=TA_CENTER, textColor=PRIMARY)))
story.append(Spacer(1, 5*mm))
story.append(Paragraph("NexusAPI Inc.", ParagraphStyle('Company', parent=body_style, fontSize=12, alignment=TA_CENTER, fontName=HEADING_FONT, textColor=TEXT_DARK)))

story.append(PageBreak())

# ==================== TABLE OF CONTENTS ====================
story.append(Paragraph("Liiska Maqaalka", h1_style))
story.append(Spacer(1, 5*mm))

toc_items = [
    ("1.", "Waa Maxay NexusAI?"),
    ("2.", "Fahamka AI (Xigashada Xaggaga Ah) - Si Fudud"),
    ("3.", "Maxay AI-yada Shiinaha Ku Jiraan Lacag Yar?"),
    ("4.", "NexusAI Waa Maxay Fursadda?"),
    ("5.", "Sida NexusAI Inay Bilyan Doolar Gaadho"),
    ("6.", "NexusAI vs Tartanka"),
    ("7.", "Qorshaha Ganacsiga - Tallaabo Tallaabo"),
    ("8.", "Waa Kuwee Maalgashadayaasha?"),
    ("9.", "Khatarta Iyo Sida Loo Gudbo"),
    ("10.", "Gabagabada - Fursad Maanta Qabso"),
]

for num, title in toc_items:
    story.append(Paragraph(
        f"<b>{num}</b>&nbsp;&nbsp;&nbsp;{title}",
        ParagraphStyle('TOC', parent=body_style, fontSize=12, leading=20, spaceAfter=3*mm)
    ))

story.append(PageBreak())

# ==================== SECTION 1 ====================
story.append(Paragraph("1. Waa Maxay NexusAI?", h1_style))

story.append(Paragraph(
    "NexusAI waa shirkad cusub oo technology ah oo isku keenta AI-yada (Xigashada Xaggaga Ah) ee wadamada Shiinaha iyo dunida, waxayna siisaa dadka iyo shirkadaha fursad ay isticmaalaan AI-yada ugu fiican dunida lacag aad u yar. Waa sida Xiriirkada Telefoonka - shirkad keliya oo isku xirta telefoono kala duwan, laakiin macmiilku wuxuu isticmaalaa telefoon keliya. Sidaas oo kale, NexusAI waxay isku xirtaa AI-yo kala duwan oo ka yimid shirkado kala duwan, laakiin isticmaaluhu wuxuu isticmaalaa akhbar (API key) keliya.",
    body_style
))

story.append(Paragraph(
    "Fikradan fudud oo weyn: Shiinaha waxay leeyihiin AI-yo aad u fiican oo qaab ahaan iyo aqoon ahaan la mid ah kuwa Maraykanka sida ChatGPT, laakiin qiimahoodu waa 95% ka yar! Tusaale ahaan, haddii ChatGPT ku lacagayso $20 bishiiba, AI la mid ah oo Shiinaha laga yidhaahdo DeepSeek waxay ku lacagaysaa $1 oo keliya. NexusAI waxay qaabaysaa fursaddan ay dadka iyo shirkaduhu isticmaalaan AI-yadaan lacag yar iyagoo u baahan inay akhbar keliya isticmaalaan.",
    body_style
))

story.append(Paragraph(
    "NexusAI waa sida OpenRouter - shirkad Maraykan ah oo isku xirta AI-yo badan - laakiin NexusAI waxay diiradda saartaa AI-yada Shiinaha ee lacagta yari ah. Tani waa fursad weyn maadaama AI-yada Shiinaha ay noqonayaan kuwa ugu isticmaalka badan dunida sababtoo ah lacagtoodu waa yar yihiin, aqoonthooduna waa sarreeyaan.",
    body_style
))

# ==================== SECTION 2 ====================
story.append(Paragraph("2. Fahamka AI (Xigashada Xaggaga Ah) - Si Fudud", h1_style))

story.append(Paragraph("Waa maxay AI?", h2_style))
story.append(Paragraph(
    "AI (Artificial Intelligence) ama Xigashada Xaggaga Ah waa barnaamij kumbuyuutar ah oo awooda uu leeyahay inuu fekero, barto, iyo jawaabo su'aalaha sida aadanaha. Tusaale ahaan, haddii aad weydiiso 'Qor warqad iibinta guri', AI waxay ku qori kartaa warqad dhammaystiran oo qurux badan oo sida aadanaha ah. AI waxay kaloo awooda leedahay inay tarjunto luqado, xisaabiso, qorto koodh, iyo wax badan oo kale. Maanta, AI waxaa isticmaala shirkad kasta oo weyn dunida, laga bilaabo Google ilaa Facebook ilaa banksigaaga.",
    body_style
))

story.append(Paragraph("Sida AI U Shaqeeyso - Tusaale Fudud", h2_style))
story.append(Paragraph(
    "Fikir sidaan: Haddii aad leedahay maktabad weyn oo buugo ah, iyo aad rabto inaad helo macluumaad ku saabsan 'guriga iibka ah Magaalada New York', waad ka soo saari kartaa buuga kasta oo aad akhrido, laakiin taasi waxay qaadanaysaa waqti badan. AI waa sida kaaliyahaaga maktabada ee aad u sheego 'I hel buug kasta oo ku saabsan guryaha New York', wuuna kuu keenaa dhammaan macluumaadka waqti aad u yar. Sidaas oo kale, AI waxay awooda leedahay inay akhrido oo fahanto macluumaad badan oo waqti aad u yar, kadibna kuu bixiso jawaab dhammaystiran.",
    body_style
))

story.append(Paragraph("AI-yada Caanka Ah ee Dunida", h2_style))
story.append(Paragraph(
    "Dunida maanta, AI-yada ugu caansan waa kuwan: ChatGPT oo laga sameeyay Maraykanka, Claude oo laga sameeyay Maraykanka, iyo DeepSeek, Qwen, GLM-4, Moonshot oo laga sameeyay Shiinaha. AI-yada Shiinaha waxay aqoondheer yahiin waana lacag yar - taasi waa fursadda NexusAI.",
    body_style
))

# ==================== SECTION 3 ====================
story.append(Paragraph("3. Maxay AI-yada Shiinaha Ku Jiraan Lacag Yar?", h1_style))

story.append(Paragraph(
    "Su'aashan waa muhiim sababtoo ah fursadda NexusAI dhammaanteed waxay ku salaysan tahay jawaabtaan. Waxaa jira sababo saddex oo weyn oo AI-yada Shiinaha lacagtoodu yartahay:",
    body_style
))

story.append(Paragraph(
    "<b>1. Kharashka Shaqaalaha Waa Yar: </b>Shiinaha, kharashka shaqaalaha technology waa 60-80% ka yar Maraykanka. Injineerka AI ee Shiinaha waxaa lacagaysa $20,000-$40,000 sanadkii, halka Maraykanka uu lacagayo $150,000-$300,000. Taani micnaheedu waa shirkadaha Shiinaha inay sameeyaan AI aad u fiican kharash aad u yar.",
    body_style
))

story.append(Paragraph(
    "<b>2. Taageerada Dowladda: </b>Dowladda Shiinaha waxay siisaa taageero weyn oo lacag ah iyo nidaam ah shirkadaha AI. Dowladdu waxay tahay in AI noqoto waaxda weyn ee kobcinta dhaqaalaha, sidaas darteed bay taageertaa shirkadaha sida DeepSeek, Alibaba (Qwen), iyo Zhipu AI (GLM-4). Taani waxay ka dhigaysaa in shirkadahan ay sameeyaan AI-yo heer sare ah oo lacag yar.",
    body_style
))

story.append(Paragraph(
    "<b>3. Tartanka Waa Aad U Weyn: </b>Shiinaha waxaa jira shirkado AI ah oo badan oo tartamaya, taasoo micno ah in qof kastaa uu isku dayo inuu bixiyo adeegga ugu fiican ee lacagta ugu yar. Tartankan waa kan abuuraya fursadda NexusAI - waqtiyadan, AI-yada Shiinaha waa kuwa ugu lacagta yari ee aqoondheeraha dunida.",
    body_style
))

# Price comparison table
story.append(Paragraph("Isbarbardhigga Qiimaha AI-yada", h2_style))

table_data = [
    [Paragraph('<b>AI Model</b>', body_bold_style),
     Paragraph('<b>Waddanka</b>', body_bold_style),
     Paragraph('<b>Lacag/1M Erey</b>', body_bold_style),
     Paragraph('<b>Lacag/1M Jawaab</b>', body_bold_style)],
    ['GPT-4o', 'Maraykanka', '$2.50', '$10.00'],
    ['Claude 3.5', 'Maraykanka', '$3.00', '$15.00'],
    ['DeepSeek Chat', 'Shiinaha', '$0.14', '$0.28'],
    ['Qwen Turbo', 'Shiinaha', '$0.05', '$0.10'],
    ['GLM-4', 'Shiinaha', '$0.15', '$0.15'],
    ['Yi Lightning', 'Shiinaha', '$0.05', '$0.05'],
]

t = Table(table_data, colWidths=[90, 80, 80, 90])
t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(t)
story.append(Spacer(1, 5*mm))

story.append(Paragraph(
    "Sida la arkaa, DeepSeek Chat waa 18 jeer ka yar GPT-4o! Qwen Turbo iyo Yi Lightning waa 50 jeer ka yar! Taani waa fursad weyn oo NexusAI ay isticmaalayso.",
    highlight_style
))

# ==================== SECTION 4 ====================
story.append(Paragraph("4. NexusAI Waa Maxay Fursadda?", h1_style))

story.append(Paragraph(
    "NexusAI waxay fursadda ku leedahay inay noqoto 'bogga u dhexeeya' AI-yada Shiinaha iyo dunida. Maanta, haddii qof rabo inuu isticmaalo AI-yo kala duwan oo Shiinaha ah, waa inuu akhbar (API key) kala duwan isticmaalaa, nidaam kala duwan baraa, iyo lacag kala duwan bixiyaa. Taani waa adag waana waqti qaata. NexusAI waxay siisaa akhbar keliya oo aad ku isticmaasho AI-yo dhan! Waa sadaqo waqti iyo lacag.",
    body_style
))

story.append(Paragraph("Fursadda Saddexda Weyn", h2_style))

story.append(Paragraph(
    "<b>Fursadda Koowaad: AI-yada Shiinaha Waa Kuwa Ugu Fiican ee Lacagta Yari. </b>Adduunka maanta, shirkad kastaa waxay rabtaa inay isticmaasho AI laakiin lacagtu waa weyn. ChatGPT waxay ku lacagaysaa $20 bishiiba qof kasta. DeepSeek Chat, oo aqoondheerahiisii la mid yahay, waxay ku lacagaysaa $1! Taani micnaheedu waa shirkadaha iyo dadka kastaa inay isticmaalaan AI lacag yar, sidaas oo NexusAI ay ku bixin karto AI lacagta ugu yar ee dunida.",
    body_style
))

story.append(Paragraph(
    "<b>Fursadda Labaad: Waa Adeegga Keliya ee Isku Xira AI-yada Shiinaha. </b>Maanta, shirkad kastaa oo rabta inay isticmaasho AI-yada Shiinaha waa inay akhbar kala duwan isticmaalaa. NexusAI waa shirkadda keliya oo bixisa akhbar keliya oo aad ku isticmaasho AI-yo dhan. Taani waa fursad weyn maadaama aan jirin shirkad kale oo sidaas sameyso AI-yada Shiinaha.",
    body_style
))

story.append(Paragraph(
    "<b>Fursadda Saddexaad: Suuqa AI Waa Kobcaya Dhaqan Aad U Weyn. </b>Suuqa AI ee adduunka waxaa lagu qiyaasaa inuu yahay $200 bilyan sanadka 2026, waxaana la filaa inuu gaadho $1,500 bilyan sanadka 2030. Taani micnaheedu waa in NexusAI hadday qabato 0.1% oo suuqan, waxay noqon lahayd shirkad $1.5 bilyan! Waana fursad aan badnayn.",
    body_style
))

# ==================== SECTION 5 ====================
story.append(Paragraph("5. Sida NexusAI Inay Bilyan Doolar Gaadho", h1_style))

story.append(Paragraph(
    "Su'aashan waa mid muhiim ah oo kasta oo maalgashade ah wuu weydiiyaa. Waa kuwan tallaabooyinka iyo sababta NexusAI inay gaadhi karto bilyan doolar:",
    body_style
))

story.append(Paragraph("Tallaabada 1: Kobcinta Macaamiisha (Year 1-2)", h2_style))
story.append(Paragraph(
    "NexusAI waxay bilowday bixinta AI-yada lacagta yari ah. Haddii shirkaduhu isticmaalaan AI, waxay arkaan in NexusAI ay bixiso AI la mid ah ChatGPT laakiin lacag 95% ka yar. Tusaale: shirkadda caafimaadka ee isticmaasha ChatGPT $5,000 bishiiba, haddii ay isticmaalaan NexusAI waxay bixisaan $250 oo keliya! Badbaadada $4,750 bishiiba! Taani waa sababta macaamiisha inay yimaadaan. Hadaba, haddii NexusAI hesho 10,000 macmiil oo kasta oo bixinaya $100 bishiiba (tani waa qiime aad u yar), waa $1,000,000 bishiiba, ama $12,000,000 sanadkii.",
    body_style
))

story.append(Paragraph("Tallaabada 2: Qulqulka Dhaqaalaha (Year 2-3)", h2_style))
story.append(Paragraph(
    "Marka macaamiisha ay badanyihiin, NexusAI waxay bilowday inay kasbato lacag ka badan kharashka. AI-yada Shiinaha lacagtoodu waa yar yihiin, sidaas darteed NexusAI waxay iibisaa adeegga $100 bishiiba macmiil kasta, laakiin kharashka AI-gu waa $10 oo keliya. Taani micnaheedu waa 90% faaido! Hadaba, haddii 50,000 macmiil ay jiraan, waa $5,000,000 bishiiba oo dakhli, $54,000,000 sanadkii, faaidadu waa $48,600,000 sanadkii! Taasi waa dakhli aad u weyn.",
    body_style
))

story.append(Paragraph("Tallaabada 3: Bilyan Doolar (Year 3-5)", h2_style))
story.append(Paragraph(
    "Suuqa AI waa kobcaya dhaqan aad u weyn. Haddii NexusAI ay qabato 0.5% oo suuqa AI-ga adduunka sanadka 2030 (waa $7.5 bilyan), isla markaana ay leedahay 200,000 macmiil oo bixinaya $50 bishiiba, waa $100,000,000 bishiiba, $1,200,000,000 sanadkii! Halkan ayay bilyan doolarka ka yimid. Shirkad la mid ah oo la yidhaahdo OpenRouter, oo Maraykanka laga sameeyay, ayaa hadda qiimaheedu yahay $3 bilyan, laakiin ma diiran karaa AI-yada lacagta yari ah ee Shiinaha sida NexusAI. Taani waa fursadda NexusAI.",
    body_style
))

# ==================== SECTION 6 ====================
story.append(Paragraph("6. NexusAI vs Tartanka", h1_style))

comparison_data = [
    [Paragraph('<b>Astaan</b>', body_bold_style),
     Paragraph('<b>NexusAI</b>', body_bold_style),
     Paragraph('<b>OpenRouter</b>', body_bold_style),
     Paragraph('<b>ChatGPT API</b>', body_bold_style)],
    ['Qiimaha AI', '95% ka yar', 'Qaab dhexe', 'Qaab sare'],
    ['AI-yada Shiinaha', '8+ models', 'Dhawr models', 'Maya'],
    ['Akhbar Keliya', 'Haa', 'Haa', 'Haa'],
    ['Lacagta Bilaashka', '100 eray bilaash', 'Xad badan', 'Xad yar'],
    ['Diirada', 'AI-yada lacag yar', 'AI-yo kala duwan', 'AI keliya'],
    ['Qiimaha Shirkadda', '$50M-500M', '$3 Bilyan', '$80 Bilyan'],
    ['Fursada Kobcinta', 'Aad u weyn', 'Dhexe', 'Yar (waa weyn)'],
]

t2 = Table(comparison_data, colWidths=[85, 95, 85, 85])
t2.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(t2)
story.append(Spacer(1, 5*mm))

story.append(Paragraph(
    "NexusAI waxay kala duwan tahay tartanka diiradda ay saarto AI-yada Shiinaha ee lacagta yari ah. OpenRouter waxay diiran kartaa AI-yo kala duwan laakiin ma diiransho gaar ah AI-yada Shiinaha, ChatGPT API waa akhbar keliya oo AI keliya, halka NexusAI ay diiran karto AI-yo badan oo lacag yar. Taani waa faa'iidada competititive ah ee NexusAI.",
    body_style
))

# ==================== SECTION 7 ====================
story.append(Paragraph("7. Qorshaha Ganacsiga - Tallaabo Tallaabo", h1_style))

steps = [
    ("Tallaabada 1: Samee Barnaamijka (Month 1-3)",
     "Samee nidaamka API-ga ee isku xira AI-yada Shiinaha. Qor koodhka, tijaabi, oo hubi inay shaqeyso. La xiriir shirkadaha AI-yada Shiinaha sida DeepSeek, Alibaba, Zhipu AI si aad u hesho akhbaartooda. Samee bogga internetka oo dadka ku ogolaanayo inay akhbar (API key) diiwaangeliyaan."),
    ("Tallaabada 2: Hel Macaamiisha Koowaad (Month 3-6)",
     "Bilow dhowr boqol oo macmiil oo bilaash ah si ay u tijaabiyaan adeegga. Ku dhawaaq bulshada technologyada, qor blogga, iyo la wadaag dadka isticmaala AI. Hubi in macaamiishu ay qanci karaan, kadibna bixin karaan. Hadaf: 1,000 macmiil oo bixinaya."),
    ("Tallaabada 3: Koree Adeegga (Month 6-12)",
     "Kudar AI-yo cusub, kudar nidaamka billing-ka, kudar analytics, kudar webhooks. Samee SDK-yada si fudud oo dadka isticmaali karaan. Koree xirfadda marketing-ka. Hadaf: 10,000 macmiil."),
    ("Tallaabada 4: Koree Adduunka (Year 2-3)",
     "La faallo shirkadaha weyn. Samee nidaamka enterprise-ka. Kudar taageero luqado badan. Kudar AI-yo cusub oo ka yimid Shiinaha iyo wadamada kale. Hadaf: 50,000 macmiil. La xiriir maalgashadayaasha si aad u hesho lacag dhaqaaleed."),
    ("Tallaabada 5: Bilyan Doolar (Year 3-5)",
     "Marka NexusAI ay leedahay 100,000+ macmiil iyo dakhli $50M+ sanadkii, waxay noqon kartaa shirkad bilyan doolar. Qiimaha shirkadda waa ku saabsan dakhliyada iyo kobcinta. Shirkadda OpenRouter oo la mid ah ayaa $3 bilyan qiimaheed, laakiin NexusAI waxay diiradda saartaa AI-yada lacagta yari ah oo tartanka aan lahayn."),
]

for title, desc in steps:
    story.append(Paragraph(title, h2_style))
    story.append(Paragraph(desc, body_style))

# ==================== SECTION 8 ====================
story.append(Paragraph("8. Waa Kuwee Maalgashadayaasha?", h1_style))

story.append(Paragraph(
    "NexusAI waxay raadisaa maalgashadayaasha ah oo awooda uu leeyahay inuu bixiyo lacag dhaqaaleed iyo xirfad. Waa kuwan noocyada maalgashadayaasha ee NexusAI u baahan tahay:",
    body_style
))

story.append(Paragraph(
    "<b>1. Maalgashadayaasha Hore (Angel Investors): </b>Waa dadka bixinaya $10,000-$100,000 si ay u noqdaan saamiyayaasha hore. Waa inay aqoonayaan technologyda, inay rumaysan yihiin AI-yada Shiinaha, iyo inay fahmaan suuqa AI-ga. Faa'iidadoodu waa inay qaataan 5-10% oo saami ah.",
    body_style
))

story.append(Paragraph(
    "<b>2. Lacag Dhaqaaleed Venture Capital (VC): </b>Waa shirkadaha bixinaya $500,000-$5,000,000 marka NexusAI ay macaamiil iyo dakhli qabato. Waa inay arkaan kobcin weyn iyo fursad weyn. Faa'iidadoodu waa inay qaataan 15-30% oo saami ah.",
    body_style
))

story.append(Paragraph(
    "<b>3. Saamiyayaasha Strategic: </b>Waa shirkadaha AI ee Shiinaha oo rabta inay gashaa suuqa Maraykanka iyo adduunka. Tusaale: Alibaba oo maalgashaysa NexusAI si ay u gashaa suuqa Maraykanka AI-yada Qwen. Taani waa fursad labada dhinac oo faa'iido leh.",
    body_style
))

# ==================== SECTION 9 ====================
story.append(Paragraph("9. Khatarta Iyo Sida Loo Gudbo", h1_style))

story.append(Paragraph(
    "Sida ganacs kasta oo kale, NexusAI waxay leedahay khataro. Laakiin waa khataro la gudbo karo haddii la qorshaysanno. Waa kuwan khatarta iyo sida loo gudbo:",
    body_style
))

risk_data = [
    [Paragraph('<b>Khatarta</b>', body_bold_style),
     Paragraph('<b>Heerka</b>', body_bold_style),
     Paragraph('<b>Sida Loo Gudbo</b>', body_bold_style)],
    ['Shiinaha oo xirista AI-yada', 'Dhexe', 'Isku xir AI-yo ka badan Shiinaha, kudar AI-yo Maraykan iyo Yurub'],
    ['Tartanka oo kordha', 'Sare', 'Kobci gaari, kudar AI-yo cusub, kharash yar'],
    ['Macmiil laa an', 'Dhexe', 'Marketing xooggan, qiime yar, bilaash aqbal'],
    ['Khatarta Technology', 'Hoose', 'Tijaab badan, nidaam xirmo, koodh hagaagsan'],
    ['Khatarta Lacagta', 'Dhexe', 'Kharash yar, dakhli horaantii, maalgasho VC'],
]

t3 = Table(risk_data, colWidths=[100, 55, 185])
t3.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(t3)

# ==================== SECTION 10 ====================
story.append(Paragraph("10. Gabagabada - Fursad Maanta Qabso", h1_style))

story.append(Paragraph(
    "NexusAI waa fursad weyn oo ku saabsan AI-yada Shiinaha ee lacagta yari ah. Shiinaha waxay sameeyeen AI-yo aad u fiican oo 95% ka yar ChatGPT. NexusAI waxay isku xirtaa AI-yadaan si dadka iyo shirkaduhu isticmaalaan lacag yar. Suuqa AI waa kobcaya dhaqan aad u weyn, iyo haddii NexusAI ay qabato xitaa qayb yar oo suuqan, waxay noqon kartaa shirkad bilyan doolar.",
    body_style
))

story.append(Paragraph(
    "Waqtiyadan, AI waa sida internetka sannadihii 2000-aad - qof kastaa wuu isticmaali doonaa, shirkad kastaa way u baahan doontaa. Laakiin su'aashu maaha 'haddii' ee waa 'goorma'. Shirkadaha ugu horreeya ee bixiya AI lacag yar ayaa noqon doona kuwa ugu weyn. NexusAI waa mid ka mid ah kuwa ugu horreeya oo diiran kara AI-yada Shiinaha ee lacagta yari ah.",
    body_style
))

story.append(Paragraph(
    "Fursadda maanta waa weyn, laakiin ma noqon doonto weligeed. Marka AI-yada Shiinaha ay caanka noqdaan, tartanku waa kordhi doonaa, iyo fursadda inaad tahay kan ugu horreeya way dhammaatay. Maanta waa waqtiga aad qabato fursaddan - bilow NexusAI, maalgasho, ama la shaqee. Waa fursad aan la soo noqon karin.",
    body_style
))

story.append(Spacer(1, 10*mm))
story.append(HRFlowable(width="40%", thickness=1.5, color=PRIMARY, spaceAfter=5*mm, spaceBefore=5*mm, hAlign='CENTER'))

story.append(Paragraph(
    '"AI waa shidaalka cusub ee adduunka. Qof kastaa wuu isticmaali doonaa, shirkad kastaa way u baahan doontaa. Laakiin kuwa ugu horreeya ee isticmaala lacag yar ayaa noqon doona kuwa ugu badbaada."',
    ParagraphStyle('Quote', parent=body_style, fontName=ITALIC_FONT, fontSize=12, leading=18, alignment=TA_CENTER, textColor=PRIMARY_DARK)
))

story.append(Spacer(1, 10*mm))
story.append(Paragraph("NexusAPI - AI kasta, Lacag kasta, Akhbar keliya.", footer_style))

# Build PDF
doc.build(story)
print(f"PDF generated: {output_path}")
print(f"File size: {os.path.getsize(output_path) / 1024:.1f} KB")
