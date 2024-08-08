import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCdU8NhpFT6489DMGs2MPWQSdJR5QbRJoI",
    authDomain: "team2-introduce-web-page.firebaseapp.com",
    projectId: "team2-introduce-web-page",
    storageBucket: "team2-introduce-web-page.appspot.com",
    messagingSenderId: "970550082038",
    appId: "1:970550082038:web:a526f70bcd79eece032fd7",
    measurementId: "G-XHELKFT8ZL"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

async function loadPosts() {
    {
        const querySnapshot = await getDocs(collection(db, "Members"));
        $('#card').empty();
        querySnapshot.forEach((doc) => {
            let row = doc.data();
            let id = doc.id;
            let image = row['image'];
            let name = row['name'];
            let self_description = row['self-discription'];
            let content = row['content'];
            let blog = row['blog'];
            
            let temp_html =
                `<div class="card h-100">
                                <img src="${image}" class="card-img-top" alt="${name}">
                                    <div class="card-body">
                                        <h5 class="card-title">${name}</h5>
                                        <hr>
                                        <p class="card-text">${self_description}</p>
                                    </div>
                                    <div class="card-footer">
                                        <small class="text-body-secondary">${content}</small>
                                        ${blog ? `<p><a href="${blog}" target="_blank" class="card-link">블로그 주소</a></p>` : ''}
                                        <button class="btn btn-primary btn-sm mt-2 edit-btn" data-id="${id}" style = "width: 100%;">수정</button>
                                    </div>
                            </div>`;
            $('#card').append(temp_html);
        });
    }
}

$("#postingbtn").click(async function () {
    {
        let image = $('#image').val();
        let name = $('#name').val();
        let self_description = $('#self-discription').val();
        let content = $('#content').val();
        let blog = $('#blog').val();

        if (!image || !name || !self_description || !content || !blog) {
            alert('모든 정보를 입력하세요!');
            return;
        }

        let doc = {
            'image': image,
            'name': name,
            'self-discription': self_description,
            'content': content,
            'blog': blog
        };
        await addDoc(collection(db, "Members"), doc);
        alert('저장 완료!');
        $('#postingbox').hide();
        loadPosts();
    }
});

$("#joinbtn").click(async function () {
    {
        let image = $('#join_image').val();
        let name = $('#join_name').val();
        let self_discription = $('#join_self_discription').val();
        let content = $('#join_content').val();
        let blog = $('#join_blog').val();

        if (!image || !name || !self_discription || !content || !blog) {
            alert('모든 정보를 입력하세요!');
            return;
        }

        console.log(image);

        let doc = {
            'image': image,
            'name': name,
            'self-discription': self_discription,
            'content': content,
            'blog': blog
        };

        await addDoc(collection(db, "Members"), doc);
        alert('저장 완료!');
        $('#joinbox').hide();
        loadPosts();
    }
});

$("#jointeambtn").click(function () {
    $('#joinbox').toggle();
});

$("#close_joinbox").click(function () {
    $('#joinbox').toggle();
});

$("#savebtn").click(function () {
    $('#postingbox').toggle();
});

async function setInitialValues(id) {
    let docRef = doc(db, "Members", id);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let data = docSnap.data();
        $("#edit-image").val(data.image);
        $("#edit-name").val(data.name);
        $("#edit-self-discription").val(data['self-discription']);
        $("#edit-content").val(data.content);
        $("#edit-blog").val(data.blog);
    }
}

$(document).on('click', '.edit-btn', function () {
    let id = $(this).data('id');
    $('#editbox').data('id', id);
    $('#editbox').show();
    setInitialValues(id);
});


$('#joinbox').toggle();


// 멤버카드 삭제
$("#delete_memberbtn").click(async function () {
    let id = $('#editbox').data('id');
    console.log(id);

    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
        await deleteDoc(doc(db, 'Members', id));
        alert('멤버 삭제 완료!');
        window.location.reload();
    }
});

$("#editbtn").click(async function () {
    {
        let id = $('#editbox').data('id');
        let image = $('#edit-image').val();
        let name = $('#edit-name').val();
        let self_description = $('#edit-self-discription').val();
        let content = $('#edit-content').val();
        let blog = $('#edit-blog').val();

        if (!image || !name || !self_description || !content || !blog) {
            alert('모든 정보를 입력하세요!');
            return;
        }

        let docRef = doc(db, "Members", id);
        let updatedData = {
            'image': image,
            'name': name,
            'self-discription': self_description,
            'content': content,
            'blog': blog
        };
        await updateDoc(docRef, updatedData);
        alert('수정 완료!');
        $('#editbox').hide();
        loadPosts();
    }
});

async function loadGuestbook() {    
    const querySnapshot = await getDocs(collection(db, "Guestbook"));    
    $('#guestbook-container').empty();
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        console.log(data);
        let guestbookTime = new Date(data.timestamp).toLocaleString();
        let guestbook_html =
            `<div class="card mb-2" data-id="${doc.id}">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">${data.message}</p>
                                <hr>
                                <p class="card-text"><small class="text-muted">${guestbookTime}</small></p>
                            </div>
                            <button class="btn btn-danger btn-sm delete-btn">삭제</button>
                        </div>
                    </div>`;
        $('#guestbook-container').append(guestbook_html);
    });
}

loadPosts();
loadGuestbook();

$('#postingbtn').click(function () {
    $('#mypostingbox').toggle();
});

$('#guestbookbtn').click(function () {
    window.open("guestbook.html", "_blank", `width=1000, height=600, toolbars=no, scrollbars=no`);    
});

$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('#scroll-to-top').fadeIn();
    } else {
        $('#scroll-to-top').fadeOut();
    }
});

$('#scroll-to-top').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});

$('#submit-guestbook').click(async function (event) {
    event.preventDefault();
    let name = $('#guestbook-name').val();
    let message = $('#guestbook-message').val();

    if (!name || !message) {
        alert('이름과 메시지를 모두 입력하세요.');
        return;
    }

    let currentDate = new Date();
    let timestamp = currentDate.getTime();

    let guestbookEntry = {
        name: name,
        message: message,
        timestamp: timestamp
    };

    try {
        await addDoc(collection(db, 'Guestbook'), guestbookEntry);
        alert('방명록이 성공적으로 작성되었습니다.');
        
        $('#guestbook-name').val('');
        $('#guestbook-message').val('');

        loadGuestbook();
    } catch (error) {
        console.error('방명록 작성 중 오류 발생:', error);
        alert('방명록을 작성하는 중에 오류가 발생했습니다.');
    }
});

$('#membersbtn').click(function () {
    $('html, body').animate({
        scrollTop: $('#card').offset().top
    }, 600);
});

$('#introbtn').click(function () {
    $('html, body').animate({
        scrollTop: $('.static-cards').offset().top
    }, 600);
});

$(document).on('click', '.edit-btn', function () {
    let id = $(this).data('id');
    $('#editbox').data('id', id);
    $('#editbox').show();


    $('html, body').animate({
        scrollTop: $('#editbox').offset().top
    }, 600);
});

$('#close-editbox').click(function () {
    $('#editbox').hide();

    $('html, body').animate({
        scrollTop: $('#membersbtn').offset().top
    }, 600);
});



$('#close-guestbook').click(function () {
    $('#myguestbookbox').hide();


    $('html, body').animate({
        scrollTop: $('#guestbookbtn').offset().top
    }, 600);
});

$(document).on('click', '.delete-btn', async function () {
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
        let card = $(this).closest('.card');
        let id = card.data('id');

        try {
            await deleteDoc(doc(db, 'Guestbook', id));
            card.remove();
            alert('방명록이 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제하는 중에 오류가 발생했습니다.');
        }
    }
});

// 방명록 팝업창에서 데이터 받아오기
export function GetGuestbookContent(Name, guestbookContentData, guestBookWindow) {
    if (!Name || !guestbookContentData) {
        alert('이름과 메시지를 모두 입력하세요.');
        return;
    }

    DB_SaveGuestBookContent(Name, guestbookContentData, guestBookWindow);    
}


// 받아온 데이터로 DB에 접근해 저장하기
async function DB_SaveGuestBookContent(name, message, guestBookWindow) {
    let currentDate = new Date();
    let timestamp = currentDate.getTime();
    let guestbookEntry = {
        name: name,
        message: message,
        timestamp: timestamp
    };

    await addDoc(collection(db, 'Guestbook'), guestbookEntry);
   
    loadGuestbook();
    // 방명록 팝업창 닫기
    guestBookWindow.close();
    opener.location.reload();
}
