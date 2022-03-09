# Portfolio Ekleme

- Başarılı Transaction Sonucu
- Porfolyodan tamamı satılırsa -> removeFromPortfolio
- Bir kısmı satılırsa -> NOTHING
- Yeni hisse alınırsa -> addToPortfolio

# getUserStock(user_id, share_id)

- Transactions BUY ve SELL lerin yekünü BUY -> 1 + SELL -> -1

# User Balance

# Postman Collection

- GET PORTFOLIO
- GET SHARES
- GET TRANSACTIONS BY SHARE
- GET TRANSACTIONS BY USER

# Database Seeds / Migration (Sequelize init)

- Transaction
  user_id: Akbank share: AKB amount: 5000 price: 0 type: BUY
  user_id: TRT share: TRT amount: 5000 price: 0 type: BUY
  user_id: ETC share: AKB amount: 5000 price: 0 type: BUY
- Örnek Karşılıksız(Afaki) Order
- Hisse Senetleri

# Refactoring - BOL BOL
