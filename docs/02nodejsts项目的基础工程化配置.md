# Nodejs/Ts项目的基础工程化配置

嗨，大家好，我是Mokel，欢迎回来，这期视频的主题是为我们的项目进行基础的工程化配置。点赞投币收藏，为视频的更新注入强劲动力，我们走着。

在上期视频中，我提到monorepo的一个优势点是，可以让我们在跨团队的多个项目中标准化一套代码prettier、eslint，以及git hook 等配置，那么我们先来盘点一下具体有哪些可以在项目中快速创建和配置的工具。

每当编码完成时，我们往往希望能够使用相关工具按照一定的规则对代码进行代码质量和格式检查，检查通过后再提交代码，如果存在问题，则工具会输出一系列报错或警告信息，这个工具就是Eslint。除此之外，Eslint也可以对代码进行一定的自动格式化，但这并不是Eslint的侧重点，所以我们还会引入Prettier来对我们的代码进行自动格式化以统一代码风格，

如果仅有Eslint和Prettier，那我们需要在代码提交前手动执行Prettier和Eslint对代码进行格式化以及代码质量和格式检查，但我们希望在提交代码时自动执行Eslint对代码进行检查，那么我们可以使用git的hook功能，为git命令创建我们所需要的钩子，在这里我们使用Husky工具来创建、管理代码仓库中的所有git hooks。

而随着代码存储库的代码量增多，如果在每一次提交代码时，我们都对存储库内的全量代码执行prettier和eslint命令，则必然会性能吃紧；所以，我们希望提交代码时只对当前发生了代码变更的文件执行prettier和eslint命令，同时略过我们所忽略的文件，那么我们就需要用上lint-staged工具。

提交代码时，利用git hook除了进行上述的代码格式检查外，我们还希望对commit message进行格式检查，确保其基本符合Angular规范，使得跨团队多项目时的commit message保持一致性，这有利于后续我们在项目中根据commit message自动生成changelog和release note，此时，我们就需要用上commitlint工具。

而既然我们对commit message进行了格式检查，那么我们一定会希望有个工具协助我们生成符合规范的commit message，而不是完全手动创建，此时则可以引入commitizen工具，当然这方面还有其他可选择的工具，如gitcz等。

最后，如果你和你的小伙伴都使用vscode进行开发，并且你们希望获取较为一致的vscode开发体验，那么安装一些插件和创建项目内的vscode配置文件就是必不可少的一项工作，我们将在项目内创建vscode的拓展安装建议和设置这两方面的配置文件，分别为extensions.json和settings.json。

很好，我们现在已经盘点完了项目中常用的工程化工具，整理一下，它们分别是Eslint，Prettier，Husky（创建管理git-hook），lint-staged，commitlint，commitizen（gitcz），项目内vscode配置。接下来，我们在仓库中逐一应用上述的工程化工具。

打开上一期视频中完成的项目；在根目录下安装所需的依赖，通过pnpm命令进行安装（
pnpm add -w -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin）。安装完成后在根目录下分别创建 .eslintrc 和 .eslintignore 文件，在 .eslintrc文件中填充一些配置项：

- root：hover上去可以看到该配置项的介绍，该配置项主要用于指示此.eslintrc文件是Eslint在项目内使用的根级别文件，并且 ESLint 不应在该目录之外搜索配置文件
- parser：默认情况下，Eslint使用其内置的 Espree 解析器，该解析器与标准 JavaScript 运行时和版本兼容，而我们需要将ts代码解析为eslint兼容的AST，所以此处我们使用 @typescript-eslint/parser。
- extends：该配置项告诉eslint我们拓展了哪些指定的配置集，其中
  - eslint:recommended ：该配置集是 ESLint 内置的“推荐”，它打开一组小的、合理的规则，用于检查众所周知的最佳实践
  - @typescript-eslint/recommended：该配置集是typescript-eslint的推荐，它与eslint:recommended相似，但它启用了特定于ts的规则
  - @typescript-eslint/eslint-recommended ：该配置集禁用 eslint:recommended 配置集中已经由 typeScript 处理的规则，防止eslint和typescript之间的冲突。
- plugins：该配置项指示要加载的插件，这里 @typescript-eslint 插件使得我们能够在我们的存储库中使用typescript-eslint包定义的规则集。
  然后在.eslintignore中填入当前需要忽略的文件，包括 所有node_modules文件夹 和 pnpm-lock.yaml 文件。

接下来，我们在package.json中新增执行eslint工具的脚本，关于我们所使用的eslint命令行工具的可用options，可以在eslint的官方文档https://eslint.org/docs/latest/use/command-line-interface#中获取详细信息。

我们在ex-app/src/index.ts文件中写一个空函数test，这是一段不符合eslint规则集的代码，我们在终端里用pnpm执行我们刚刚添加的eslint的脚本，可以看到eslint输出了错误警告，这意味着我们已经创建和配置好了eslint。

删除有问题的代码，我先提交一个commit。

【Prettier】
接下来我们要引入和配置Prettier，通过 pnpm命令安装prettier（pnpm add -w -D prettier），完成安装后，在项目根目录下创建 .prettierrc 和 .prettierignore 文件，我们给.prettierrc文件填充了一小部分配置，你的配置不需要与我的保持一致，你应该和你的团队沟通讨论，从而确定你们所需要的最佳实践；.prettierignore文件中我们同样忽略所有node_modules文件夹和pnpm-lock.yaml文件。关于prettier的详细的配置项，你可以查阅官网文档https://prettier.io/docs/en/options了解详细信息。

然后我们在package.json中增加一个format脚本，如我所演示：prettier --config .prettierrc '.' --write。简单修改代码，比如删除行尾的分号，然后执行format脚本，可以看到代码被正确格式化即自动添加了行尾分号。终端里有警告信息，这是因为我在 .prettierrc 文件中添加了 prettier 未知的选项用作注释，所以我们不管这个警告信息。而在你的实际的项目中，你不需要添加以这种形式出现的注释。

现在我们仍然需要手动在终端中执行脚本来调用prettier从而对代码进行格式化，但我们的诉求是在编码过程中持续的自动的按我们的配置对代码进行格式化，这个诉求在大部分编辑器中，如vscode、vim，都很容易满足，只需要在编辑器中安装prettier的插件即可。但假如你在记事本中编写代码，也就是在那些没有prettier插件支持的编辑器中编写代码，我们还可以使用prettier官方推荐的另一种方式来满足该诉求，即利用onchange工具。

在项目根目录下安装依赖，通过pnpm命令安装（pnpm add -w -D onchange），你可以查看官方文档https://prettier.io/docs/en/watching-files, https://www.npmjs.com/package/onchange 了解详细信息。依赖安装好后，在package.json中增加一个format-watch脚本，如我所演示：onchange -d 1000 '\*_/_' -- prettier --config .prettierrc --write {{changed}}，在终端中运行该脚本，可以看到它已经在运行中了。然后我们使用mac的文本编辑器打开package.json文件，键入几行空行；用vscode打开该文件查看可以发现空行已经存在了；回到文本编辑器，保存文件，可以看到命令行有了信息输出，但文本编辑器所展示的代码似乎并没有任何变化，此时我们在文本编辑器中保存，会有系统提示弹出，通过该提示，我们其实可以确认onchange已经对package.json文件进行了修改；我们再次用vscode打开该文件查证一下，可以看到空行已经没了，说明onchange确实生效了。

整理一下代码，在接着写新代码前，我们先提交一个commit。

【Prettier 和 Eslint 协同工作】
此时，我们的存储库中已经同时存在Prettier和Eslint，我们需要进行一定的配置来确保Prettier和Eslint正确的协同工作，你可以查阅Prettier文档https://prettier.io/docs/en/comparison，https://prettier.io/docs/en/integrating-with-linters了解详细信息，同时也可以查看相关文章进一步学习 https://www.robinwieruch.de/prettier-eslint/，https://khalilstemmler.com/blogs/tooling/prettier/，我已将相关文档文章的链接放在了简介中。

简单的说，Eslint既包含代码质量规则，也包含代码风格规则，当我们使用Prettier来对代码进行格式化时，Eslint的大部分代码风格的规则其实是不必要的，而且更糟糕的是，Eslint的代码风格的规则往往会跟Prettier发生冲突，所以我们需要应用一些Eslint的配置集来关闭与Prettier冲突或不必要的规则，并且将Prettier的规则转换为Eslint的规则，从而让Eslint能够完全按照我们的诉求向我们提供错误或警告信息。

在这里，我们会用上两个配置，分别为eslint-config-prettier 和 eslint-plugin-prettier，前者作用是关闭所有可能干扰 Prettier 规则的 ESLint 规则，确保将其放在最后，这样它有机会覆盖其他配置集，后者作用是将 Prettier 规则转换为 ESLint 规则。

在终端中安装这两个包，通过pnpm命令安装（pnpm add -w -D eslint-config-prettier eslint-plugin-prettier）。安装好后，我们往 .eslintrc 文件中填入新内容，分别是extends prettier 配置，加载 prettier 插件，和添加三条rules，其作用分别为：

- "extends": ["prettier"] 的作用是启用 eslint-config-prettier配置集，这会关闭一些与 Prettier 冲突的 ESLint 规则
- "plugins": ["prettier"]（加载prettier插件）该插件将 Prettier 规则转换为 ESLint 规则
- "prettier/prettier": "error"（这条rule）打开eslint-plugin-prettier插件提供的规则，该插件从 ESLint 内运行 Prettier
- "arrow-body-style": "off" and "prefer-arrow-callback": "off" 关闭对应的这两个 ESLint 核心规则，这两个规则和prettier插件一起使用会出现问题，具体你可以查看这个issue：https://github.com/prettier/eslint-plugin-prettier/blob/master/README.md#arrow-body-style-and-prefer-arrow-callback-issue

至此，我们便完成了Eslint和Prettier的引入与配置，它们之间也能够完美地协同工作了。我们来完整演示一下，（禁用掉vscode的相关插件）首先先注释掉 .eslintrc 中的pretier相关的配置，然后对代码进行一些修改，此时我们保存文件，文件是不会自动格式化的。在终端中执行 pnpm run lint，此时没有任何报错或警告信息输出；回退注释，再次执行pnpm run lint，会发现终端中有错误信息输出，说明插件已经把prettier规则转换为eslint规则，并且在eslint中生效了；然后我们执行pnpm run format-watch脚本，再次保存相关文件，文件都自动被格式化了。非常完美，这正是我们想要的效果。

在继续编码前，我们先提交一个commit。

【Husky】
接下来，我们来引入git hooks，我们将通过Husky工具来为我们创建所需要的git hook，你可以查看Husky的官网https://typicode.github.io/husky/了解更多信息。首先在项目根目录下安装husky包，通过pnpm命令进行安装（pnpm add -w -D husky）；完成安装后，通过npx执行husky命令启用 git hook（npx husky install），此外，我们需要在package.json中新增一个prepare脚本，如我所演示："prepare": "husky install" ，使得当其他人克隆该项目并安装依赖时会自动通过husky启用git hook。

我们需要的第一个git hook是在提交commit之前执行我们的eslint工具对代码进行质量和格式检查，也就是在提交commit之前执行package.json中的lint脚本，我们通过husky命令来创建pre-commit这个git hook，如我所演示：（npx husky add .husky/pre-commit "pnpm run lint"），可以看到 .husky 文件夹下已经有了pre-commit 这个git hook，让我们来验证一下它是否能够有效工作。

先对代码做出一些修改，使得代码不满足当前的esint规则，比如我们删掉一个分号、新增几行空行，然后提交一个commit。从终端中可以看到，确实执行了package.json中的lint脚本，然后eslint输出了错误信息，并且中断了git commit过程，这非常好，符合我们的预期。我们现在执行format脚本格式化代码，然后重新提交commit。无报错未中断，一切都是好的，Husky正确发挥了它的作用。

【lint-staged】
接下来我们要引入lint-staged工具，回顾一下，它的作用是仅对变更的文件执行相关操作，在这里，就是执行eslint检查这项操作，同时还能忽略我们所要忽略的文件。我们先在项目根目录下安装lint-staged，通过pnpm命令完成安装（pnpm add -w -D lint-staged）。大家可以查看文档https://www.npmjs.com/package/lint-staged阅读lint-staged的详细教程。

安装完成后，我们创建 .lintstagedrc.js 配置文件，lint-staged的配置文件可以是不同的文件格式，具体大家可以查看文档中的Configuration部分，我们在这里使用了js文件格式，是因为我们需要在配置文件中编写代码。让我们来填充一下该配置文件。大家可以看到该配置文件中的代码片段的含义是，对所有被lint-staged检测到的文件，其中过滤掉我们所需要忽略的文件，然后执行eslint脚本。

此外，我们还需要手动更改一下husky为我们创建的pre-commit这个git hook，将其变更为执行lint-staged命令（npx lint-staged），而不是直接执行package.json中的脚本。修改完成后，我们提交一个commit，来看看效果，可以看到，lint-staged对这几个文件执行了eslint命令，而这这几个文件正好是我们变更过且git add了且不是被忽略的文件。这完全符合我们的预期，说明lint-staged配置成功了。

【commitlint】
下一步，我们要引入commitlint工具，如同前文所阐述，我们将使用commitlint工具并搭配git hook从而在提交commit前对我们的commit message进行格式检查。我们先在项目根目录下安装commitlint相关的依赖，通过pnpm命令完成安装（pnpm add -w -D @commitlint/cli @commitlint/config-conventional）。可以查阅commitint的官方文档https://commitlint.js.org/#/，https://commitlint.js.org/#/guides-local-setup?id=install-commitlint了解更多详细信息。

安装完成后，在项目根目录下创建配置文件 .commitlintrc.json，并向其中填入内容，其中

- "extends": ["@commitlint/config-conventional"] 的作用是直接拓展官方的预设配置，
- "rules": { "scope-empty": [2, "never"] }而这条规则是要求commit message的scope即范围不能为空。
  然后我们使用Husky添加 commit-msg的git hook，通过npx执行husky命令完成添加（npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'），它的作用是在我们提交commit或者修改commit-msg时对commit-msg执行相关校验，如此一来，我们就可以确保我们的项目拥有一个统一的符合规范的commit message。我们通过两个例子（不符合规范 和 符合规范）来演示一下效果，可以看到，满足我们的预期，这意味着commitlint配置成功。

【commitizen】
commitlint配置好了，下一步就是要引入commitizen来帮助我们便捷地创建符合commitlint规范的commit message。我们先在项目根目录下安装 commitizen 和 cz-conventional-changelog 依赖，通过pnpm命令完成依赖安装（pnpm add -w -D commitizen cz-conventional-changelog），你可以查阅链接https://www.npmjs.com/package/commitizen，https://www.npmjs.com/package/cz-conventional-changelog 获取关于commitizen 和 cz-conventional-changelog 的详细文档。

安装好后，我们创建 .czrc 配置文件，并向文件中填入内容，其中

- cz-conventional-changelog是commitizen的 conventional-changelog 适配器，使用该适配器，commitizen将以AngularJS 的commit message规范逐步引导我们完成commit message的创建。

然后在package.json中新增脚本，如我所演示："cz": "cz"，先通过git add将所有的变更文件添加到暂存区，再在命令行中通过pnpm执行该脚本，可以看到终端中有了对应的步骤和信息提示，非常好，一切都在我们的预料之中，满足了我们的诉求。

【vscode插件和项目内vscode配置】
最后，如果你也是用vscode作为代码编辑器，那么你可以安装这两个插件。我们再次进行刚刚修改代码的操作，可以看到，当我修改代码后，立即就有了eslint的错误提示信息，这就是Eslint插件的作用，它可以即时的根据我们项目中的eslint配置向我们反馈代码问题；然后我保存一下文件，代码就被自动格式化了，而这便是Prettier插件的作用，它可以即时的根据我们项目中的prettier配置格式化我们的代码，而这个也正是我们在之前使用的onwatch工具的作用，现在我们可以不再使用onwatch了，而是使用vscode的Prettier插件。

很有可能，当你保存文件的时候，代码并没有被自动格式化，而这正是因为你的vscode没有进行相关配置，那么我们就要来创建一些项目内的vscode配置，这样就可以让该项目的每一个使用vscode的开发者都能获得一致的vscode体验，当然了，如果你或者你的团队使用的是其他编辑器，那么你同样可以使用类似的方式来取得一致的开发体验。

我们在项目根目录下创建 .vscode 文件夹，然后在文件夹内创建两个文件，分别是extensions.json 和 settings.json，前者是推荐用vscode打开该项目的开发者安装什么插件，后者是项目内的vscode配置，关于vscode的配置，我在三年前录制的那几个很啰嗦的视频里有比较完整的讲过，感兴趣的朋友可以去看一看，当然你也可以完全不用关心配置的具体含义，只需要使用即可。

这里要补充一点内容，eslint 默认会忽略一些文件，具体为 node_modules/ 目录，dot文件（ .eslintrc.\* 文件除外），dot文件夹及其子文件夹，详细信息可以查看eslint文档https://eslint.org/docs/latest/use/configure/ignore。所以如果我们希望eslint对 .vscode文件夹内的文件进行lint检查的话，我们需要在 .esintignore 配置文件中填入这段内容，其含义为 强制eslint不忽略.vscode文件夹。

为了查看效果，我们在 .lintstagedrc.js 文件内加入log代码，然后再注释掉我们刚补充的强制不忽略的配置，在终端执行lint-staged命令，可以看到ignoredFiles 数组输出均为true，表示这4个文件均为eslint忽略了；回退刚刚的注释，我们再来执行一下lint-staged命令，此时可以看到 .vscode 文件夹下的两个文件不再被eslint忽略。

而在这里我将保持eslint的默认配置，所以删掉这一行配置。

至此，我们比较系统和完整的对我们的nodejs/ts项目进行了基础的工程化配置，还记得我们在上一期视频中留下的关于project refrences 和 tsc --build 的疑惑点吗？我们将在下一期视频中探索它，记得点赞投币收藏，我们下期视频，不见不散！
