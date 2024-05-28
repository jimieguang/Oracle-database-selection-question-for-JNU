import re
import json

# 假设原始文本保存在一个名为 'questions.txt' 的文件中
with open('questions.txt', 'r', encoding='utf-8') as file:
    content = file.read()

# 分割文本为单个问题块
question_blocks = content.split('Question No :')[1:]

questions_json = []

for block in question_blocks:
    # 提取问题文本
    question_text_match = re.search(r'\n\n(.+?)(?=\nA\.)', block, re.DOTALL)
    question_text = question_text_match.group(1).strip() if question_text_match else ""

    # 提取选项，假设选项以 'A.', 'B.', 等开始，且后面跟着任意非换行的文本，直到遇到下一个选项前缀或者 'Answer:'
    # 在 '.' 后面加上 '\s*' 来匹配任意数量的空格
    options_match = re.findall(r'(?<=\n|\s)([A-G]\.\s+.+?)(?=\s*[A-G]\.\s+|Answer:|$)', block, re.DOTALL)
    options = [opt.strip() for opt in options_match]

    # 提取答案，这里同样在 'Answer:' 后面加上 '\s*' 来匹配任意数量的空格
    answer_match = re.search(r'Answer:\s*([A-G]+(?:,\s*[A-G]+)*)', block)
    # 在逗号后面也加上 '\s*' 以匹配答案之间可能存在的任意数量的空格
    answer = answer_match.group(1).replace(',', '').strip() if answer_match else ""

    # 提取解析
    explanation_match = re.search(r'Explanation:\s*(.+?)(?=\n\nQuestion No :|\Z)', block, re.DOTALL)
    explanation = explanation_match.group(1).strip() if explanation_match else ""

    # 构建 JSON 结构
    question_json = {
        "question": question_text,
        "options": options,
        "answer": list(answer),  # 将答案字符串转换为列表
        "explanation": explanation
    }
    questions_json.append(question_json)

# 将问题列表转换为 JSON 并保存到文件
with open('questions.json', 'w', encoding='utf-8') as json_file:
    json.dump(questions_json, json_file, ensure_ascii=False, indent=4)
