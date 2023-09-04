嗨，大家好，我是 Mokel，我将在这期视频开始 【startup about monorepo，fastify，Phaser，colyseus and threejs】 系列分享，点赞投币收藏，为视频的更新注入强劲动力，我们走着。

这期视频，我们来分享【monorepo 项目创建与基础演示】，内容较少，简单易懂。

我已经在之前创建了一个空仓库，我将在这个仓库中更新代码。你可以在 github 关注仓库的更新，我会将每期视频对应的代码提交到仓库中。

我们在终端中用 vscode 打开该项目，其中已经有 README.md 和 .gitignore 文件，然后我们可以用 npm init --force 和 tsc --init 分别初始化 package.json 和 tsconfig.json 文件，但我会以手动的方式创建这两个文件。与此同时，我后续将使用 pnpm 安装管理依赖，以及设置 monorepo 的 workspace，所以打开 pnpm 的官网，看一下如何安装 pnpm，我们主要看一下脚本安装和 npm 安装两种方式，注意，如果你的团队对版本有特定需求，安装时记得带上版本号。

我们给 package.json 填充了一点内容，tsconfig.json 先留空只写一个大括号，我们接下来先来看一下 monorepo 和 pnpm。

monorepo 是一种软件开发方法，其中一个存储库包含多个项目的代码和静态资源，它的整体结构如同我所展示的这样，注意 package.json 和 tsconfig.json 文件不要留空，可以写一个大括号进去。

我习惯于将 apps 和 packages 分开，apps 和 packages 中可以是任何东西，从单个 app 到可重用的组件包到 utils 函数等，而这些 packages 我们将它称为 local package，即本地包，在需要的时候我们可以将 local package 发布到 npm，我们将在【github 发版和 npm 发包】视频中演示如何通过 github action 构建产物并发包。

一个 monorepo 项目通常包含多个 app 和多个 pkg，app 可以依赖 pkg，pkg 也可以依赖另一个 pkg，例如 ui 包可以依赖 utils 包，但 apps 之间通常不应该相互依赖。关于 monorepo 的适用场景以及限制条件，欢迎大家在评论区讨论探究，我在视频中就不展开聊了，不过我想提一个点，就是 monorepo 可以让我们在跨团队的多个项目中标准化一套代码 pretty、eslint，以及 git hook 等配置，我将在下一期【nodejs/ts 项目的基础工程化配置】视频中演示如何创建和配置代码格式化工具以及 git-hook 等。

现在，我们需要在项目根目录下创建 pnpm-workspace.yaml 文件，向其中添加内容。关于 pnpm，你可以现在暂停视频，打开 pnpm 的官网，了解学习一下，当然我建议你后续再去探究学习 pnpm。那么回到这个 yaml 文件，简单的说，这个文件的作用是告知 pnpm，当前存储库是一个 monorepo 项目，并且该项目有两个 workspace，分别位于 apps 下和 packages 下，也就是说这两个文件夹下的子文件夹是具体的独立的 app 和 pkg。

我们用最简单的例子来演示一下 monorepo 的实际应用，我们先在项目根目录下为项目安装基础依赖，通过 pnpm add -w -D typescript ts-node @types/node 来安装，注意使用 pnpm 安装依赖，-w 表示在 monorepo 项目根目录下安装依赖，-D 表示安装为 devDependencies。

安装好依赖后，我们需要为 typescript 创建配置文件。先创建一个 tsconfig.option.json 文件，这个文件名不需要跟我的一样，你也可以使用如 tsconfig.base.json 等，在该文件中添加部分 compilerOptions 的配置项，具体如我所演示；完成 tsconfig.option.json 后，我们回过头来配置 tsconfig.json 文件，其内容如我所演示。

很好，我们完成了 typescript 的配置，接下来，我们编码一些实际代码来演示 monorepo。

首先填充 utils package，分别更新 package.json、tsconfig.json 文件，并在 src 文件夹下创建 index.ts 文件，然后写入一个工具函数，这里我们创建一个简单的 add 函数。此时，我们还未完全完成 package.json 和 tsconfig.json 文件的填充，不着急，我们一会需要的时候回过头来继续补充。相同的操作，我们对 ex-app 也填充基础内容。

现在，我们需要在 ex-app 中安装 utils package，即 ex-app 依赖 utils package，并引用 utils 包中的 add 函数。我们先直接通过 pnpm 尝试安装一下依赖，看看会发生什么事情。

我们可以看到，它正确安装了 utils 这个 local package，但 import 时会报错，具体报错信息为：“Cannot find module '@voidoor/utils' or its corresponding type declarations”，并且，add 函数也没有正确的类型信息。

我们回到 utils 包，对其进行一点简单的更新，向 package.json 中添加字段 main，并将其设置为 index.ts 文件，该字段表示 utils 包的入口文件是什么。回到 apps/ex-app 中，我们发现错误提示已经消失了，并且 add 函数有了正确的类型提示。在终端中使用 ts-node 执行 ex-app 的 index.ts 文件，得到了正确的结果。如果你的全局环境未安装 ts-node，那么在 ex-app 的 package.json 中增加这段脚本，并在终端中用 pnpm 执行它，也可以得到正确结果。

我想，此时应该会有朋友存在一些疑惑，比如，我们似乎并没有用上 tsconfig.json 文件，文件中的关于 project reference 的配置项也没有起到什么作用，我现在把 tsconfig.json 文件删掉后再用 pnpm 执行脚本，也是可以得到正确结果。另一方面，我们也还没用上常见的 tsc --build 命令来构建 js 产物、d.ts 文件和 sourcemap 文件。不过问题不大，我们先暂时留着这些疑惑点，它们将在后续视频中逐一演示。

至此，我们已经完成了【monorepo 项目创建与基础演示】，我已将代码推到了刚刚的 github 仓库，下期视频，我们将分享【nodejs/ts 项目的基础工程化配置】，我们下期视频，不见不散！
