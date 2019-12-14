"use strict";
var Simple = require("./bot_filter/SimpleFilter");
var apiFB = require("./api/getapiFB");
var app_main = require("../app");

var async = require("asyncawait/async");
var await = require("asyncawait/await");

class BotAsync{
    constructor() {
        var helpFilter = new Simple(["help", "giúp đỡ", "giúp với", "giúp mình", "giúp"],
            `Do bot mới được phát triển nên chỉ có 1 số tính năng sau:
                1. Thông tin về chủ tôi
                2. Tra cứu giá vàng
                3. Tra cứu thời tiết
                4. Tin tức về Bitcoin
                5. Xem và đặt lịch những sân bóng mini của cũng tôi.
                Cảm ơn ! 😉`);
        var botInfoFilter  =  new Simple(["may la ai", "may ten gi", "may ten la gi",
                "ban ten la gi", "ban ten gi", "ban la gi",
                "bot ten gi", "bot ten la gi", "your name"],
            "Mình là chat bot. Viết bởi anh Hoài đập chai cute <3");
        var adInfoFilter = new Simple(["ad may la ai","ad la ai", "hoi ve ad", "ad ten gi", "who is ad",
                "ad la thằng nào", "thong tin ve ad", "ad dau", "admin",
                "ai viet ra may", "who made you", "ad la gi", "ad ten la gi","thong tin ve chu toi"],
            "Bạn vào đây xem thêm nhé: https://facebook.com/zimmer.jeyy/");
        var thankyouFilter = new Simple(["cam on", "thank you", "thank", "nice", "hay qua",
            "gioi qua", "good job", "hay nhi", "hay ghe"], "Không có chi. Rất vui vì đã giúp được cho bạn ^_^");
        this._goodbyeFilter = new Simple(["tạm biệt", "bye", "bai bai", "good bye"], "Tạm biệt, hẹn gặp lại ;)");
        this._helloFilter = new Simple(["hi", "halo", "hế nhô", "he lo", "hello", "chào", "xin chào", "helo", "alo", "ê mày"],);
        this._filters = [thankyouFilter,helpFilter,this._goodbyeFilter,this._helloFilter, adInfoFilter, botInfoFilter];
    }
    setSender(sender)
    {
        this._helloFilter.setOutput(`Chào ${sender.last_name} ${sender.first_name} , bạn cần gì ở tôi! \n - Bạn có thể gõ "help" để biết thêm các chức năng của tôi nhá`);
        this._goodbyeFilter.setOutput(`Tạm biệt ${sender.first_name}, hẹn gặp lại ;)`);
    }
    chat(input) 
    {
        for(var filter of this._filters)
        {
            // console.log(filter.isMatch(input));
            if(filter.isMatch(input))
            {
                return filter.reply(input);
            }
        }
    }
        bot_reply(sender_id,input)
        { var reply;
            async(()=>{
                var sender = await (apiFB.getSenderName(sender_id));
                this.setSender(sender);
                if(await (this.chat(input))===undefined)
                {
                    reply = {
                        "text" : "Xin lỗi bot còn nhỏ dại nên không hiểu. Bạn gõ help xem thêm nhé :(?"
                    }
                    apiFB.callSendAPI(sender_id,reply);
                }else{
                    reply = {"text" : await(this.chat(input))};
                    apiFB.callSendAPI(sender_id,reply);
                }
            })();
        }
    }

module.exports = new BotAsync();
