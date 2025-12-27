import telebot
from telebot import types
import requests
import uuid

# --- НАСТРОЙКИ ---
TOKEN = '8416813317:AAGXIVvCv9irjn1uPym2x2hpQP5m-ZcS6yA'
BOT_OWNER_USERNAME = 'pavelian'
DOWNLOAD_LINK = 'https://sayovpn.replit.app'
API_URL = 'https://sayovpn.replit.app/api'  # URL вашего Replit приложения

bot = telebot.TeleBot(TOKEN, parse_mode='HTML')


def generate_key_for_user(user_id, username):
    """Генерирует ключ через API и возвращает его"""
    try:
        response = requests.post(
            f'{API_URL}/keys',
            json={
                'telegramUserId': str(user_id),
                'telegramUsername': username or 'unknown'
            },
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                return data.get('key')
    except Exception as e:
        print(f"Error generating key: {e}")
    return None


# --- ГЛАВНОЕ МЕНЮ ---
def get_main_menu():
    markup = types.InlineKeyboardMarkup(row_width=1)
    btn_get_key = types.InlineKeyboardButton("🔑 ПОЛУЧИТЬ КЛЮЧ", callback_data='get_key')
    btn_download = types.InlineKeyboardButton("📥 СКАЧАТЬ SAYOVPN", url=DOWNLOAD_LINK)
    btn_inst = types.InlineKeyboardButton("💎 ИНСТРУКЦИЯ", callback_data='show_guide')
    btn_status = types.InlineKeyboardButton("📊 СТАТУС СЕРВЕРОВ", callback_data='show_status')
    
    markup.add(btn_get_key)
    markup.add(btn_download)
    markup.add(btn_inst, btn_status)
    return markup


# --- КОМАНДЫ ---
@bot.message_handler(commands=['start'])
def start(message):
    welcome_text = (
        "<b>🛡 SayoVPN Premium Service</b>\n"
        "──────────────────────\n\n"
        "👋 <b>Добро пожаловать!</b>\n\n"
        "Нажмите <b>ПОЛУЧИТЬ КЛЮЧ</b> чтобы\n"
        "получить ваш персональный ключ доступа.\n\n"
        "──────────────────────\n"
        "📡 <b>Статус сети:</b> <code>ONLINE</code> ✅"
    )
    bot.send_message(message.chat.id, welcome_text, reply_markup=get_main_menu())


# --- ОБРАБОТКА КНОПОК ---
@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    if call.data == 'get_key':
        # Генерируем новый ключ
        bot.answer_callback_query(call.id, "⏳ Генерация ключа...")
        
        key = generate_key_for_user(
            call.from_user.id,
            call.from_user.username
        )
        
        if key:
            text = (
                "✅ <b>Ваш ключ успешно создан!</b>\n\n"
                "──────────────────────\n"
                f"<code>{key}</code>\n"
                "──────────────────────\n\n"
                "📋 <b>Как использовать:</b>\n"
                "1. Скачайте SayoVPN\n"
                "2. Скопируйте ключ выше\n"
                "3. Вставьте в приложение\n\n"
                "⚠️ <i>Не передавайте ключ другим!</i>"
            )
        else:
            text = (
                "❌ <b>Ошибка генерации ключа</b>\n\n"
                "Попробуйте позже или обратитесь в поддержку."
            )
        
        markup = types.InlineKeyboardMarkup()
        markup.add(types.InlineKeyboardButton("📥 СКАЧАТЬ SAYOVPN", url=DOWNLOAD_LINK))
        markup.add(types.InlineKeyboardButton("⬅️ НАЗАД", callback_data='back_to_menu'))
        
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id, reply_markup=markup)

    elif call.data == 'show_guide':
        text = (
            "📖 <b>РУКОВОДСТВО SAYOVPN</b>\n"
            "──────────────────────\n\n"
            "1️⃣ Нажмите <b>ПОЛУЧИТЬ КЛЮЧ</b>\n\n"
            "2️⃣ Скачайте приложение\n\n"
            "3️⃣ Вставьте ключ в приложение\n\n"
            "4️⃣ Нажмите кнопку подключения\n\n"
            "──────────────────────\n"
            "💡 <i>Один ключ = один аккаунт</i>"
        )
        markup = types.InlineKeyboardMarkup()
        markup.add(types.InlineKeyboardButton("⬅️ НАЗАД", callback_data='back_to_menu'))
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id, reply_markup=markup)

    elif call.data == 'show_status':
        text = (
            "🌐 <b>СТАТУС СЕРВЕРОВ</b>\n"
            "──────────────────────\n\n"
            "🇷🇺 RU-MSK: 🟢 <b>ONLINE</b>\n"
            "🇳🇱 NL-AMS: 🟢 <b>ONLINE</b>\n"
            "🇩🇪 DE-FRA: 🟢 <b>ONLINE</b>\n\n"
            "──────────────────────\n"
            "📊 <i>Обновлено только что</i>"
        )
        markup = types.InlineKeyboardMarkup()
        markup.add(types.InlineKeyboardButton("⬅️ НАЗАД", callback_data='back_to_menu'))
        bot.edit_message_text(text, call.message.chat.id, call.message.message_id, reply_markup=markup)

    elif call.data == 'back_to_menu':
        welcome_text = (
            "<b>🛡 SayoVPN Premium Service</b>\n"
            "──────────────────────\n\n"
            "👋 <b>Главное меню</b>\n\n"
            "──────────────────────\n"
            "📡 <b>Статус сети:</b> <code>ONLINE</code> ✅"
        )
        bot.edit_message_text(welcome_text, call.message.chat.id, call.message.message_id, reply_markup=get_main_menu())


if __name__ == '__main__':
    print("🤖 SayoVPN Bot запущен...")
    bot.infinity_polling(timeout=90)
