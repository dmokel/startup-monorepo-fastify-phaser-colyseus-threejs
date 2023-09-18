嗨，大家好，我是Mokel，主业写代码，喜欢做些视频记录与分享，偶尔折腾小硬件，也拍拍测测数码科技产品，

在前两期视频我们了解了monorepo项目的简要基础，并且进行了较为系统完整的nodejs/ts项目的工程化配置，感兴趣的朋友可以订阅这个系列合集；那这期视频我们将在项目内创建一个local package，同时创建一个使用该local package的基于fastify的简单web服务，记得点赞投币收藏，为视频的更新注入强劲动力，我们走着！

我们要实现的简单web服务是对前端传递过来的以太坊地址进行判别，判断该地址是否为具有某个函数的合约地址，比如可以用来判断以太坊地址是否是一个多签钱包合约地址，所以我们将创建一个local package，将判别逻辑封装在其中，并对外暴露一个或多个判别函数，然后我们再创建一个app，该app将主要依赖我们的local package 和 fastify 来创建web服务，提供API接口，接受以太坊地址作为入参，并将判别结果作为响应返回。

打开我们在上期视频中完成的项目，我们先来创建一个local package，命名为address-discrimination，然后创建子文件夹和添加基本的文件，并向其中填入相关内容，包括package.json，tsconfig.json 和 index.ts，具体如我所演示。

我们来具体看看index.ts中的内容，它的函数代码应该长这样：
export const isMethodExist = () => {}
下一步就是要来实现具体的判断逻辑。我们打开浏览器搜索一下：How to check if a method exists in solidity contract?，看一下stack overflow的这个话题，我之前在这个问题下写过一个答案，其中包括函数实现和使用示例，我现在直接复制下来使用。

我们需要先安装一下依赖，此时，我们要在具体的package的根目录下安装依赖，而不再是如前几期视频中在项目的根目录下安装依赖，这个时候我们有两种方式，一种是进入到对应的目录下，比如在这里，我们可以通过命令行进入到address-discrimination目录下，然后通过pnpm命令安装所需要的依赖，如我所演示（pnpm add web3）。可以看到，我们正确完成了该依赖的安装。

回到项目根目录，我们来使用另一种方式安装具体app或pkg所需要的依赖，在项目根目录的package.json中新增一个脚本，如我所演示（"address-discrimination": "pnpm --filter @voidoor/address-discrimination"）；然后我们就可以在项目根目录下通过该脚本从而在address-discrimination package中进行相关操作，比如安装我们还未安装的viem包，如我所演示（pnpm address-discrimination add viem）。可以看到，我们同样也正确完成了依赖安装。

你可能会遇到pnpm抛出 missing peer 警告信息，此时你可以在项目根目录下创建 .npmrc 文件，并向其中填入相关配置，如我所演示（auto-install-peers=true, strict-peer-dependencies=false）；关于此内容的详细信息你可以查阅pnpm的官方文档 了解更多（https://pnpm.io/npmrc#peer-dependency-settings）

代码中还有一些警告，hover上去可以看到是eslint发出的警告，具体的规则是代码中不能出现显式的any类型，我们调整一下这个规则，在 .eslintrc 文件的rules中新增一条规则关闭该警告，如我所演示："@typescript-eslint/no-explicit-any": "off"。

（可能发生）另外，代码中还有ts反馈的关于viem包的类型警告，这个可能是viem包的一个类型bug，不过我们在项目根目录的tsconfig.json中已经启用了skipLibCheck选项，所以在使用tsc --build时不会因为这个类型问题而导致编译失败；而这里你可以通过as any的方式来让编辑器不发出这个类型警告，如我所演示。

准备好address-discrimination pkg后，我们来创建address-check application，我们将在该app中基于fastify和address-discrimination pkg创建web服务，并对外提供API接口。

依旧是创建一些基础的文件夹和文件，如我所演示。

然后安装 fastify 和 @voidoor/address-discrimination 依赖，通过pnpm命令完成安装。

然后开始编写我们的web服务。首先在src下创建app.ts和api文件夹，在api文件夹内创建endpoints子文件夹，以及routes.ts、server.ts 和 index.ts文件，在endpoints文件夹内创建address-check文件夹，然后在address-check文件夹内创建single-address子文件夹和index.ts文件，最后在single-address文件夹内创建v1.ts文件。

我们先在routes.ts文件中编写代码，如我所演示：

```ts
import { FastifyInstance } from 'fastify';

export const httpRoutes = async (server: FastifyInstance) => {
  server.get('/', () => {
    return `Address Check Server ${new Date()}`;
  });
};
```

然后在server.ts文件中编写代码，如我所演示：

```ts
import Fastify, { FastifyHttpOptions } from 'fastify';
import http from 'http';
import { httpRoutes } from './routes';

export const Server = async (opts?: FastifyHttpOptions<http.Server> | undefined) => {
  const server = await Fastify({
    logger: false,
    ...opts,
  });

  await server.register(httpRoutes);

  return server;
};
```

然后在index.ts文件中编写代码，如我所演示：

```ts
import { Server } from './server';

export const start = async () => {
  const server = await Server();

  server.listen({ port: 8777, host: '0.0.0.0' }, (err, addr) => {
    if (err) {
      console.log('err:', err);
      process.exit(1);
    }
    console.log(`listening at ${addr}`);
  });
};
```

然后在app.ts文件中编写代码，如我所演示：

```ts
import { start } from './api';

process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection, err: ${err}`);

  // For now, just skip any unhandled errors
  process.exit(1);
});

const setup = async () => {
  /\*_empty _/;
};

setup().then(() => start());
```

现在，我们写好了一个根路径API，它响应一段字符串，其中带有最新的时间信息。我们来启动它，我们先直接通过ts-node来启动该web服务，在终端中执行ts-node命令启动服务（ ts-node apps/address-check/src/app.ts）， 如果你的全局环境没有安装ts-node，那么先将该脚本添加到address-check application的package.json中，然后在该app的根目录通过pnpm执行它启动服务（pnpm address-check run debug）。可以看到服务正常启动了。我们新开一个终端，用curl命令调用一下该服务的根路径API（curl http://12.7.0.0.1:8777），输出了预期的响应 Address Check Server Thu Aug 17 2023 22:01:06 GMT+0800 (中国标准时间)。非常好，我们现在已经准备好了一个最简web服务demo。

接下来开始添加地址判断的逻辑代码。在我们之前创建的v1.ts文件内编写代码，如我所演示

```ts
import { RouteShorthandOptionsWithHandler } from 'fastify';

export const CheckSingleAddressV1: RouteShorthandOptionsWithHandler = {
  handler: async (req) => {
    const address = (req.query as any).address as string;
    if (!address) throw new Error('unexpected empty address');
    console.log('address:', address);
  },
};
```

然后在address-check文件夹下的index.ts文件中编写代码，如我所演示：

```ts
export _ from './single-address/v1';
```

回到routes.ts文件内添加一个新的api route，如我所演示：

```ts
import { FastifyInstance } from 'fastify';
++ import \_ as addressCheckEndpoints from './endpoints/address-check';

export const httpRoutes = async (server: FastifyInstance) => {
server.get('/', () => {
return `Address Check Server ${new Date()}`;
});

++ server.get('/address-check/single-address/v1', addressCheckEndpoints.CheckSingleAddressV1);
};
```

我们来测试一下，先启动web服务，然后用curl命令调用一下api接口，记得传入对应的query参数：curl http://127.0.0.1:8777/address-check/single-address/v1？address=0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5。可以看到，地址正确的打印在了终端中。

接下来，我们来实现地址判别的具体业务逻辑。在src文件夹下创建一个新的子文件夹address-check，并在其中新建index.ts文件；在文件内编写我们的业务逻辑代码，它的核心是一个类，并且该类以私有静态成员变量的方式存储了我们需要预先初始化 好的变量，以公共静态函数的方式对外提供业务逻辑函数，如我所演示：

```ts
import { isMethodExistC } from '@voidoor/address-discrimination';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const execTransactionABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      {
        internalType: 'enum Enum.Operation',
        name: 'operation',
        type: 'uint8',
      },
      { internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
      { internalType: 'uint256', name: 'baseGas', type: 'uint256' },
      { internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
      { internalType: 'address', name: 'gasToken', type: 'address' },
      {
        internalType: 'address payable',
        name: 'refundReceiver',
        type: 'address',
      },
      { internalType: 'bytes', name: 'signatures', type: 'bytes' },
    ],
    name: 'execTransaction',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export class AddressCheckManager {
  private static publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  });

  public static async isExecTransactionMethodExist(address: string) {
    const exist = await isMethodExistC(
      this.publicClient,
      `0x${address.slice(2, address.length)}`,
      execTransactionABI,
      'execTransaction',
      [
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        33,
        '0x4444',
        0,
        33,
        33,
        33,
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        '0x233',
      ],
    );

    return exist;
  }
}
```

【关于以太坊和区块链的介绍，引导关注】
这里的ABI数组，alchemy节点，address-discrimination包的三个isMethodExist函数，以及web3和viem这两个pkg，它们都与区块链开发相关，如果你对此不了解的话，忽略它，直接复制粘贴使用，我将在其他技术分享主题的系列视频里和大家交流区块链应用层开发的基础，比如Nft，比如zk-rollup等等，记得点赞投币收藏，然后我嘎嘎爆肝更新。

完成了业务逻辑类的编码后，回到routes.ts文件内，跳转到我们的CheckSingleAddressV1函数，更新该函数的代码，在其中import并使用我们刚刚编码好的业务逻辑函数，并将结果作为响应返回。

更新好代码后，我们来测试一下，启动web服务，然后在终端中执行curl命令，可以看到，预期的响应打印在了终端中。

到目前为止，我想，你可能已经萌生了一些疑惑。

首先是我们这繁多的文件夹和文件，毕竟我们仅仅只写了一个非常简单的web api，就搞了这么多文件夹和文件，其实这是有意为之，主要是为了演示假如在功能和代码量较大的情况下，可以采取的其中一种代码组织的方式，比如说，假如我们还有graphql服务，那么我们可以在api文件夹下新建一个graphql文件夹来组织相关的代码，此外，如果我们项目的功能模块较多，需要拆分为几个不同的领域，那么我们就可以在src文件夹下新建其他的领域文件夹来组织相关的代码。

现在，我们的ts代码已经可以通过ts-node来运行了，但这并不是一个生产环境下合适的启动服务的方式，我们还需要依赖tsc来对ts代码进行编译，构建js产物，从而能够在生产环境中使用nodejs运行时直接运行js启动服务。除了使用tsc对ts代码进行编译外，我们还可以使用esbuild，rollup，webpack等编译工具来对ts代码进行编译压缩。

接下来，我们先在address-check app的package.json中新增几个脚本，如我所演示：

```json
"clean": "rm -rf ./dist",
"compile": "tsc --build",
"build": "pnpm run clean; pnpm run compile",
"start": "node ./dist/app.js"
```

关于tsc --build你可以查阅文档https://www.typescriptlang.org/docs/handbook/project-references.html了解更多详细信息。

同时，我们也需要来更新一下tsconfig.json文件，tsc命令将加载当前项目根目录下的tsconfig.json文件作为配置文件，在tsconfig.json文件中新增这几部分内容：

```json
"declarationMap": false,
"emitDeclarationOnly": false,
"rootDir": "./src",
"outDir": "./dist"
```

然后在终端中执行pnpm命令，如我所演示：pnpm address-check run build，注意是monorepo项目根目录下执行，可以看到address-check 应用内生成了dist文件夹和tsbuildinfo文件，其中dist文件夹内是tsc工具从src下的ts代码编译出来的js代码和d.ts文件。

然后我们来执行一下编译后的js代码，通过pnpm命令执行，如我所演示：pnpm address-check run start，很不幸运，报错了，而且可以看到错误是来自于我们的本地包 address-discrimination，这里我们对以下几个方面进行更新，
首先是 address-discrimination 包的 package.json 文件我们更新main配置项，如我所演示：

```json
"main": "./dist/index.js",
```

然后是 address-discrimination 包的 tsconfig.json 文件内新增以下几项内容

```json
"declarationMap": false,
"emitDeclarationOnly": false,
"rootDir": "./src",
"outDir": "./dist"
```

最后是回到address-check app中，在tsconfig.json文件中新增refrences选项

```json
// 设置typescript的reference配置选项，在这里我们将当前app所依赖的pkg填写进去
// 需要注意的是：
// 1、path所指定的路径为文件夹时，该文件夹需要直接包含一个tsconfig.json文件
"references": [
{
"path": "../../packages/address-discrimination"
}
]
```

这几项更新的整体作用是，通过project refrences向tsc指明address-check应用依赖于address-discrimination包，从而在我们通过tsc --build编译address-check应用的ts源码时，tsc能够自动对address-discrimination包进行必要的源码编译。而对address-discrimination包的tsconfig.json文件的修改是控制tsc编译address-discrimination时的配置项，同时package.json的main入口变更为dist文件夹下的js产物，因为我们后面启动address-check应用是直接运行它的js产物，故而被import的address-discrimination包也要将其入口更新为js产物。

此时我们会发现address-check应用下的address-check logic有报错，报错信息为：Cannot find module '@voidoor/address-discrimination' or its corresponding type declarations，这是因为我们刚刚修改了address-discrimination包的入口点，即package.json文件的main字段。我们现在可以不管它。

然后在终端中执行pnpm命令，如我所演示：pnpm address-check run build，可以看到，不仅address-check app下有了tsc工具构建的dist文件夹下的js产物，而且address-discrimination pkg下也有了tsc工具构建的dist文件夹下的js产物，而这正是ts的project refrences 和 tsc --build的作用，typescript的project refrences能够基于我们在tsconfig.json文件中定义的references来检测被依赖的本地包是否有进行正确的编译，或者是否是最新的编译，如果没有，将会自动对被依赖的包执行tsc --build进行编译更新。

我们reload一下vscode窗口，此时，address-check应用下的address-check logic不再有报错，且@voidoor/address-discrimination包也能够正确的跳转。我们再来启动服务试试，看看是否能够正常运行。很好，服务正常启动。我们通过curl命令请求接口试试，接口返回了正确 的响应。都非常符合我们的预期。

视频最后，我们可以再对相关配置项做一些调整，
比如，我们可以把address-check应用的tsconfig.json文件的这三个选项禁用，如此一来，address-check应用在编译时不进行增量编译，同时不生成d.ts文件，从而clean脚本也不需要删除 tsbuildinfo文件了。

```json
"incremental": false,
"composite": false,
"declaration": false,
```

然后我们更新一下.gitignore文件，然后提交一个commit。

至此，我们便完成了本期视频的所有内容，其中逐步探究了较多基础性的内容，这些内容能够让我们对monorepo项目的作用有更进一步的认识，同时也让我们对typescript及其project refrences有了还算比较充分的了解。下期视频我们将来探索一下nodejs/ts项目的github发版和npm发包，下期视频的内容将会让我们对typescript的编译、包的export和import有更进一步的认识，那我们下期视频，不见不散！

npmjs文档
https://docs.npmjs.com/cli/v9/configuring-npm/package-json#main

Esbuild 文档
https://esbuild.github.io/api/#main-fields

nodejs文档
https://nodejs.org/api/packages.html#nodejs-packagejson-field-definitions
https://nodejs.org/api/packages.html#package-entry-points
https://nodejs.org/api/packages.html#conditional-exports
https://nodejs.org/api/packages.html#nested-conditions

d.ts类型文件入口
https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html
