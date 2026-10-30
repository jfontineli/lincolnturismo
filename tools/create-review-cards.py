from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'output' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'https://g.page/r/CbKqEeJjfi4aEBM/review'
LOGO = str(ROOT / 'site/assets/logo-lincoln.png')
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold', 'C:/Windows/Fonts/arialbd.ttf'))
BLUE = '#137e98'
INK = '#173e4c'
TEAL = '#2aada5'
YELLOW = '#ffbd44'

def text(c, x, y, value, size=8, color=INK, bold=False):
    c.setFillColor(HexColor(color)); c.setFont('ArialBold' if bold else 'Arial', size)
    c.drawString(x*mm, y*mm, value)

def qr(c, x, y, side):
    widget = QrCodeWidget(URL, barLevel='M', barBorder=4)
    bounds = widget.getBounds(); w = bounds[2]-bounds[0]
    d = Drawing(side*mm, side*mm, transform=[side*mm/w,0,0,side*mm/w,0,0])
    d.add(widget); renderPDF.draw(d,c,x*mm,y*mm)

def bg(c,w,h):
    c.setFillColor(white);c.rect(0,0,w*mm,h*mm,fill=1,stroke=0)

def boxes(c,w,h,bleed):
    # ArtBox and TrimBox describe the final cut; MediaBox includes 3 mm bleed.
    c.setTrimBox((bleed*mm,bleed*mm,(w-bleed)*mm,(h-bleed)*mm))
    c.setBleedBox((0,0,w*mm,h*mm))

c=canvas.Canvas(str(OUT/'cartao-lincoln-frente-verso.pdf'),pagesize=(96*mm,56*mm))
c.setTitle('Lincoln Turismo | Cartão 90 x 50 mm com sangria de 3 mm')
c.setAuthor('Lincoln Turismo')
bg(c,96,56);boxes(c,96,56,3)
c.setFillColor(HexColor(BLUE));c.rect(0,0,96*mm,5*mm,fill=1,stroke=0)
c.drawImage(LOGO,5*mm,11*mm,width=36*mm,height=36*mm,mask='auto')
text(c,45,43,'LINCOLN TURISMO',10,BLUE,True)
text(c,45,38,'Guia de turismo credenciado',7.3)
text(c,45,32,'Alagoas e Pernambuco',7.5,BLUE,True)
text(c,45,27,'Passeios • Transfers • Viagens',7)
text(c,45,21,'WhatsApp  (64) 99646-5656',7.5,INK,True)
text(c,45,16,'www.lincolnturismo.com.br',7.1)
text(c,45,11,'@lincolnturismoalagoas',7.1)
c.showPage()
bg(c,96,56);boxes(c,96,56,3)
c.setFillColor(HexColor(YELLOW));c.rect(0,51*mm,96*mm,5*mm,fill=1,stroke=0)
text(c,8,42,'Sua viagem vira',11,BLUE,True)
text(c,8,36,'uma boa história.',11,BLUE,True)
text(c,8,27,'Conte como foi sua experiência',7.2)
text(c,8,23,'com a Lincoln Turismo.',7.2)
text(c,8,15,'Avalie no Google',9,BLUE,True)
text(c,8,10,'Abra a câmera e leia o QR code.',6.8)
qr(c,55,10,33)
c.linkURL(URL,(55*mm,10*mm,88*mm,43*mm),relative=0)
c.save()

c=canvas.Canvas(str(OUT/'avaliacao-lincoln-digital.pdf'),pagesize=(105*mm,148*mm))
c.setTitle('Lincoln Turismo | Avalie sua experiência no Google')
bg(c,105,148)
c.setFillColor(HexColor(BLUE));c.rect(0,140*mm,105*mm,8*mm,fill=1,stroke=0)
c.drawImage(LOGO,30*mm,91*mm,width=45*mm,height=45*mm,mask='auto')
def center(y,s,size=12,bold=False,color=INK):
    c.setFont('ArialBold' if bold else 'Arial',size);c.setFillColor(HexColor(color));c.drawCentredString(52.5*mm,y*mm,s)
center(86,'Como foi sua experiência?',16,True,BLUE)
center(77,'Obrigado por viajar com a Lincoln Turismo.',9)
center(71,'Seu relato ajuda outros viajantes a nos conhecer.',8.7)
qr(c,31.5,23,42)
center(19,'Avalie no Google',13,True,BLUE)
center(13,'Leia o QR code ou use o link enviado na mensagem.',8)
c.linkURL(URL,(15*mm,10*mm,90*mm,66*mm),relative=0)
c.setFillColor(HexColor(TEAL));c.rect(0,0,105*mm,5*mm,fill=1,stroke=0)
c.save()

# Export the exact encoded matrix, with 4-module quiet zone, as a reusable PNG.
w=QrCodeWidget(URL,barLevel='M');w.qr.make()
matrix=w.qr.modules; n=len(matrix); scale=16; border=4
im=Image.new('RGB',((n+2*border)*scale,)*2,'white');draw=ImageDraw.Draw(im)
for row in range(n):
    for col in range(n):
        if matrix[row][col]:
            x=(col+border)*scale;y=(row+border)*scale
            draw.rectangle((x,y,x+scale-1,y+scale-1),fill='black')
im.save(OUT/'qrcode-avaliacao-lincoln.png')
(OUT/'mensagem-para-clientes.txt').write_text('Olá! Aqui é o Lincoln. Obrigado por escolher a Lincoln Turismo!\n\nPode contar no Google como foi sua experiência? Seu relato ajuda outros viajantes a conhecer meu trabalho.\n\n'+URL+'\n\nObrigado e até a próxima viagem!',encoding='utf-8')
(OUT/'LEIA-ME.txt').write_text('KIT LINCOLN TURISMO\n\nGRÁFICA: cartao-lincoln-frente-verso.pdf tem duas páginas: frente e verso. Formato final 90 x 50 mm, arquivo 96 x 56 mm incluindo 3 mm de sangria em cada lado. Imprimir a 100%, sem ajustar à página. TrimBox indica o corte. Cores RGB; a gráfica deve conferir a conversão para seu perfil de impressão. Solicitar uma prova e testar a leitura do QR antes da tiragem.\n\nWHATSAPP: envie avaliacao-lincoln-whatsapp.png junto com a mensagem em mensagem-para-clientes.txt. O link também permite avaliar no próprio celular, sem precisar escanear a tela.\n\nQR CODE: aponta diretamente para '+URL+'. Não depende de assinatura ou encurtador de terceiros. O Google pode pedir login.\n\nPeça relatos espontâneos a todos os clientes, sem sugerir nota ou oferecer benefício. O cadastro e a visibilidade dependem do Google; este material não substitui a verificação do perfil.\n',encoding='utf-8')
print('PDFs, QR code e mensagem criados em',OUT)
