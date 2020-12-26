require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = '1494741747:AAHyYTkONjsTbgaHzdfXSv17mKIqFqmg42I';
var change_alias = require("./char.js");
const bot = new TelegramBot(token, {
    polling: true
});
let urlnhapdon = 'https://script.google.com/macros/s/AKfycbzIBJoQAODEDLE88621EoE5jFzGRKVRBbDseXR9FKUgLu-5CROXZVQk/exec?action=';

let arrayOrder = [];

// bot.on('message', (msg) => {
//     const username = msg.from.username;
//     const idChatt = msg.chat.id;
//     const type = ((msg.text)).split(' ')[0];
//     if (msg.text !== '/start' && msg.text !== '/huongdan') {
//         if (type != undefined) {
//             const soluong = ((msg.text)).split(' ')[1];
//             if (soluong != undefined) {
//                 const tongtien = ((msg.text)).split(' ')[2];
//                 if (tongtien != undefined) {
//                     const coin = ((msg.text)).split(' ')[3];
//                     if (coin != undefined) {
//                         const khachhang = ((msg.text)).split(' ')[4];
//                         if (khachhang != undefined) {
//                             if (type === 'M') {
//                                 const urlM = urlnhapdon + 'nhapmuahang&user=@' + username + '&soluong=' + soluong + '&tongtien=' + tongtien + '&coin=' +
//                                     coin + '&khachhang=' + khachhang;
//                                 callApi(urlM, idChatt)
//                             } else if (type === 'B') {
//                                 const urlB = urlnhapdon + 'nhapbanhang&user=@' + username + '&soluong=' + soluong + '&tongtien=' + tongtien + '&coin=' +
//                                     coin + '&khachhang=' + khachhang;
//                                 callApi(urlB, idChatt)
//                             } else {
//                                 bot.sendMessage(
//                                     idChatt,
//                                     '/huongdan để xem cách nhập đơn lên hệ thống!'
//                                 );

//                             }
//                         } else {
//                             bot.sendMessage(
//                                 idChatt,
//                                 '/huongdan để xem cách nhập đơn lên hệ thống!'
//                             );

//                         }
//                     } else {
//                         bot.sendMessage(
//                             idChatt,
//                             '/huongdan để xem cách nhập đơn lên hệ thống!'
//                         );

//                     }
//                 } else {
//                     bot.sendMessage(
//                         idChatt,
//                         '/huongdan để xem cách nhập đơn lên hệ thống!'
//                     );

//                 }
//             } else {
//                 bot.sendMessage(
//                     idChatt,
//                     '/huongdan để xem cách nhập đơn lên hệ thống!'
//                 );

//             }
//         } else {
//             bot.sendMessage(
//                 idChatt,
//                 '/huongdan để xem cách nhập đơn lên hệ thống!'
//             );

//         }
//     }
// });



bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    if (action === 'buy_order') {
        nhapDonHang('nhapmuahang', msg);
        // text = 'Hãy nhập theo cú pháp: M_SốLượng_TổngTiền_Coin_KháchHàng  (vd: M 106500 24800000 USDT Hoang)';
    }
    if (action === 'sell_order') {
        nhapDonHang('nhapbanhang', msg);
        // text = 'Hãy nhập theo cú pháp: B_SốLượng_TổngTiền_Coin_KháchHàng  (vd: B 106500 24800000 USDT Hoang)';
    }

});

function nhapDonHang(sheet, msg) {
    const fromeuser = msg.chat.username;
    const fromIdChat = msg.chat.id;
    if (arrayOrder != []) {
        arrayOrder.forEach(function(item, index, object) {
            if (item.username === fromeuser) {
                object.splice(index, 1);
            }
        });
    }
    arrayOrder.push({
        type: sheet,
        username: fromeuser,
        rate: '',
        soluong: '',
        khachhang: '',
    })
    console.log(arrayOrder);
    bot.sendMessage(fromIdChat, 'Xin mời nhập tên khách hàng:', {
        reply_markup: {
            force_reply: true
        }
    }).then(payload => {
        const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {
            bot.removeReplyListener(replyListenerId)
                // console.log(msg) // here's the reply which is I think what you want
            if (arrayOrder != []) {
                arrayOrder.forEach(function(item) {
                    if (item.username === msg.from.username) {
                        item.khachhang = change_alias(msg.text);
                        console.log(arrayOrder);





                        //nhập tổng tiền  --------------------------
                        bot.sendMessage(fromIdChat, 'Số lượng bao nhiêu?', {
                                reply_markup: {
                                    force_reply: true
                                }
                            }).then(payload => {
                                const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {
                                    bot.removeReplyListener(replyListenerId)
                                        // console.log(msg) // here's the reply which is I think what you want
                                    if (arrayOrder != []) {
                                        arrayOrder.forEach(function(item) {
                                            if (item.username === msg.from.username) {
                                                item.soluong = msg.text;
                                                console.log(arrayOrder);





                                                //nhập coin  --------------------------
                                                bot.sendMessage(fromIdChat, 'Nhập rate hiện tại', {
                                                        reply_markup: {
                                                            force_reply: true
                                                        }
                                                    }).then(payload => {
                                                        const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {
                                                            bot.removeReplyListener(replyListenerId)
                                                                // console.log(msg) // here's the reply which is I think what you want
                                                            if (arrayOrder != []) {
                                                                arrayOrder.forEach(function(item) {
                                                                    if (item.username === msg.from.username) {
                                                                        item.rate = msg.text;
                                                                        console.log(arrayOrder);



                                                                        const urlcall = urlnhapdon + item.type + '&user=@' + item.username + '&soluong=' + item.soluong + '&rate=' + item.rate + '&khachhang=' + item.khachhang;
                                                                        console.log(urlcall);
                                                                        const axios = require('axios');
                                                                        axios.get(urlcall)
                                                                            .then(response => {

                                                                                bot.sendMessage(
                                                                                    payload.chat.id,
                                                                                    `Lên đơn thành công!\nMã đơn:` + response.data.result + `\nSố lượng:` + item.soluong +
                                                                                    `\nRate:` + item.rate + `\nKhách hàng: ` + item.khachhang + `\nCám ơn quý khách!`, {
                                                                                        parse_mode: 'HTML',
                                                                                    }
                                                                                );
                                                                                console.log(response.data.result);
                                                                            })
                                                                            .catch(error => {
                                                                                console.log(error);
                                                                            });
                                                                    } else {
                                                                        console.log('có vẫn đề ở nhập coin');
                                                                    }
                                                                });
                                                            } else {
                                                                console.log('có vẫn đề ở if (arrayOrder != []) trong phần nhập coin');
                                                            }
                                                        })
                                                    })
                                                    //kết thúc nhập coin -----------------------

                                            } else {
                                                console.log('có vẫn đề ở nhập tổng tiền');
                                            }
                                        });
                                    } else {
                                        console.log('có vẫn đề ở if (arrayOrder != []) trong phần nhập tổng tiền');
                                    }
                                })
                            })
                            //kết thúc nhập tổng tiền -----------------------





                    } else {
                        console.log('có vẫn đề ở nhập số lượng');
                    }
                });
            } else {
                console.log('có vẫn đề ở if (arrayOrder != [])');
            }
        })
    })
}

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'ĐƠN MUA HÀNG', callback_data: 'buy_order' }],
                [{ text: 'ĐƠN BÁN HÀNG', callback_data: 'sell_order' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
            force_reply: true,
        })
    };
    // console.log(msg)
    bot.sendMessage(msg.chat.id, 'Nhập giao dịch:', options);
});