let questions = []; // 用于存储所有问题
let currentQuestionIndex = 0; // 当前问题的索引
let correctAnswers = []; // 当前问题的正确答案数组

// 当文件被选中时，立即读取
document.getElementById('file-input').addEventListener('change', function(event) {
    // 隐藏选项框
    if (event.target.files.length > 0) {
        // 如果有文件被选中，隐藏文件输入框
        event.target.style.display = 'none';
      }
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            questions = JSON.parse(content);
            if (questions.length > 0) {
                currentQuestionIndex = 0;
                displayQuestion(questions[currentQuestionIndex]); // 显示第一个问题
            }
        } catch (error) {
            alert('文件格式不正确！');
        }
    };
    reader.readAsText(file);
      
});

// 显示问题和选项
function displayQuestion(questionObj) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');
    const nextButton = document.getElementById('next-btn');

    // 清空之前的内容
    questionElement.textContent = '';
    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';
    explanationElement.textContent = '';
    explanationElement.classList.add('hidden');
    nextButton.classList.add('hidden'); 

    // 设置问题文本
    questionElement.textContent = currentQuestionIndex + 1 + '. ' + questionObj.question;
    correctAnswers = questionObj.answer; // 设置正确答案数组

    // 创建选项
    questionObj.options.forEach((option, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'option';
        input.value = String.fromCharCode(65 + index); // 设定值为"A", "B", "C"等
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${option}`));
        optionsElement.appendChild(label);
        optionsElement.appendChild(document.createElement('br'));
    });
}

// 提交答案
function submitAnswer() {
    const options = document.getElementsByName('option');
    let selectedOptions = [];
    for (let option of options) {
        if (option.checked) {
            selectedOptions.push(option.value);
        }
    }

    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');
    const nextButton = document.getElementById('next-btn');

    if (selectedOptions.length > 0) {
        if (arraysEqual(selectedOptions.sort(), correctAnswers.sort())) {
            feedbackElement.textContent = '恭喜你，答案正确！';
            feedbackElement.style.color = 'green';
        } else {
            feedbackElement.textContent = '很遗憾，答案错误。';
            feedbackElement.style.color = 'red';
        }
        explanationElement.textContent = questions[currentQuestionIndex].explanation;
        explanationElement.classList.remove('hidden');
    } else {
        feedbackElement.textContent = '请选择至少一个选项。';
        feedbackElement.style.color = 'orange';
        return; // 如果没有选项被选中，不显示解析和下一题按钮
    }

    // 显示下一题按钮
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.classList.remove('hidden');
    }
}

// 辅助函数，用于比较两个数组是否相等
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 下一题
function nextQuestion() {
    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');
    feedbackElement.textContent = '';
    explanationElement.classList.add('hidden');

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(questions[currentQuestionIndex]);
    } else {
        alert('已经是最后一题了！');
    }
}

// 上一题
function lastQuestion() {
    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');
    feedbackElement.textContent = '';
    explanationElement.classList.add('hidden');

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(questions[currentQuestionIndex]);
    } else {
        alert('已经是第一题了！');
    }
}
