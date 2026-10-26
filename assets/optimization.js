(()=>{
const form=document.querySelector('#inquiry'),status=document.querySelector('#form-status');
form.onsubmit=e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const d=new FormData(form),phone=String(d.get('phone')).replace(/[\s().+-]/g,'');
 if(!/^\d{9,15}$/.test(phone)){status.textContent='Vui lòng kiểm tra số điện thoại (9–15 chữ số).';form.elements.phone.focus();return}
 const text=['TƯ VẤN ĐẶT TIỆC DIAMOND PALACE','Họ tên: '+d.get('name'),'Điện thoại: '+d.get('phone'),'Loại sự kiện: '+d.get('type'),'Sảnh: '+d.get('hall'),'Số khách: '+(d.get('guests')||'Cần tư vấn'),'Ngày dự kiến: '+(d.get('date')||'Chưa xác định'),'Mong muốn: '+(d.get('message')||'Trao đổi thêm')].join('\n');
 document.querySelector('#inquiry-summary').value=text;
 document.querySelector('#send-inquiry-email').href='mailto:sales.diamondpalacehalong@gmail.com?subject='+encodeURIComponent('Tư vấn đặt tiệc Diamond Palace')+'&body='+encodeURIComponent(text);
 const review=document.querySelector('#inquiry-review');review.hidden=false;
 status.textContent='Đã chuẩn bị nội dung. Yêu cầu chưa được gửi; vui lòng chọn email hoặc Messenger.';
 document.querySelector('#inquiry-summary').focus();
};
document.querySelector('#copy-inquiry').onclick=async()=>{
 const text=document.querySelector('#inquiry-summary');
 try{await navigator.clipboard.writeText(text.value);status.textContent='Đã sao chép. Bạn có thể dán vào Messenger để gửi.'}catch{ text.focus();text.select();status.textContent='Hãy sao chép nội dung đã chọn rồi dán vào Messenger.'}
};
document.querySelectorAll('[data-select-hall]').forEach(a=>a.addEventListener('click',()=>{form.elements.hall.value=a.dataset.selectHall}));
document.querySelector('#hall-cta').addEventListener('click',()=>{form.elements.hall.value=document.querySelector('#hall-name').textContent});
const formSubmit=form.querySelector('button[type=submit]');formSubmit.disabled=false;
// Ready for a consent-aware analytics integration. Never include contact fields.
document.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a)return;
 let event=a.href.startsWith('tel:')?'phone_click':a.href.includes('m.me/')?'messenger_click':a.hasAttribute('download')?'layout_download':null;
 if(event)window.dispatchEvent(new CustomEvent('diamond:conversion',{detail:{event}}));
});
})();
