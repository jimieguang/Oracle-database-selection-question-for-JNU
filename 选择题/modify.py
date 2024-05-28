# 文件名: clean_file.py

def process_file(source_file, destination_file, keyword):
    with open(source_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    with open(destination_file, 'w', encoding='utf-8') as file:
        for line in lines:
            # 删除空行
            if line.strip() == '':
                file.write(line)
            # 删除包含关键词的行
            elif keyword in line:
                continue
            # 删除只包含数字的行
            elif line.strip().isdigit():
                continue
            else:
                file.write(line)

# 调用函数处理文件
process_file('source.txt', 'questions.txt', 'Oracle 1z0-060 : Practice Test')
