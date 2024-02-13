// document.querySelector() fonksiyonu, DOM (Document Object Model) içinde belirli bir CSS selektörüne uyan ilk öğeyi seçmek için kullanılır. 
// Yani, belirli bir HTML öğesini bulmaya ve referans almaya yardımcı olur.
const textarea = document.querySelector("textarea");
const voiceList = document.querySelector("select");
const speechBtn = document.querySelector("button");

// speechSynthesis JavaScript API'si, tarayıcıda metni konuşmaya dönüştürmek için kullanılır. Bu API, tarayıcının metni sesli okuma yeteneğini sağlar. 
let synth = speechSynthesis; // tarayıcı tarafından sağlanan API
let isSpeaking = true; // Konuşma durumunu takip eden değişken

voices();

function voices(){
    // Tarayıcının mevcut ses seçeneklerini alıp , açılır listeye ekleyen fonksiyon

    for(let voice of synth.getVoices()){
        let selected = voice.name === "Google US English" ?
        "selected" : ""; // Başlangıçta ingilizce seçili olsun.
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend" , option);
    }
}
/*
voiceList: HTML içinde belirli bir yere (genellikle bir liste veya başka bir konteyner) referans olan bir değişken veya DOM öğesidir.
.insertAdjacentHTML("beforeend", option): Bu metot, belirtilen HTML içeriğini (option) belirtilen HTML öğesinin (voiceList) içine ekler. 
"beforeend" parametresi, içeriğin hedef öğenin içeriğinin en sonuna eklenmesini sağlar.*/

// Ses seçenekleri değiştiğinde sesleri tekrar listeler.
synth.addEventListener("voiceschanged",voices);

function textToSpeech(text){
    // Metni sesli olarak konuşan fonksiyon
    // SpeechSynthesisUtterance sınıfı, konuşma için kullanılacak metni temsil eder.
    let utterance = new SpeechSynthesisUtterance(text);

    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice; // Açılır listeleden seçilen ses ile okur.
        }
    }
    // Utterance nesnesinin sesli okuma işlemi tamamlandığında bu olay tetiklenir.
    utterance.addEventListener("end",()=> {
        isSpeaking = false; // Sesli okuma durumu false olarak ayarlanır
        document.querySelector(".placeholder").computedStyleMap.display = "none";
        // Yukarıdaki satır, belirli bir placeholder'ı gizlemek için CSS stilini "none" olarak ayarlar.
    });

    // speechSynthesis.speak(utterance) ifadesi, belirtilen metni sesli olarak okumak için tarayıcıya talimat verir.
    synth.speak(utterance);
    isSpeaking=true;
}

speechBtn.addEventListener('click',(e)=>{
    // e.preventDefault(); kodu, bir olayın (event) varsayılan davranışını iptal etmek için kullanılır. Özellikle, bu ifade genellikle bir olay dinleyici fonksiyonu içinde kullanılır.
    e.preventDefault();

    // Metin alanı boş değilse
    if(textarea.value !== ""){
        // Sesli okuma işlemi başlamamışsa
        if(!synth.speaking){
            textToSpeech(textarea.value); // Belirtilen metni sesli olarak oku
            document.querySelector(".placeholder").computedStyleMap.display="block";
        }
    }
});