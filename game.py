import curses

def main(stdscr):
    # Отключаем отображение курсора
    curses.curs_set(0)

    # Получаем размеры окна
    height, width = stdscr.getmaxyx()

    # Определяем меню
    menu = ["Начать игру", "Выход"]
    current_row = 0

    def print_menu(stdscr, selected_row_idx):
        stdscr.clear()
        for idx, row in enumerate(menu):
            x = width//2 - len(row)//2
            y = height//2 - len(menu)//2 + idx
            if idx == selected_row_idx:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(y, x, row)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(y, x, row)
        stdscr.refresh()

    # Настраиваем цветовую пару для выделения
    curses.start_color()
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)

    print_menu(stdscr, current_row)

    while True:
        key = stdscr.getch()

        if key == curses.KEY_UP and current_row > 0:
            current_row -= 1
        elif key == curses.KEY_DOWN and current_row < len(menu) - 1:
            current_row += 1
        elif key == curses.KEY_ENTER or key in [10, 13]:
            if current_row == 0:
                stdscr.addstr(height//2 + len(menu)//2 + 1, width//2 - len("Начинаем игру...")//2, "Начинаем игру...")
                stdscr.refresh()
                stdscr.getch()
            elif current_row == 1:
                break

        print_menu(stdscr, current_row)

curses.wrapper(main)
