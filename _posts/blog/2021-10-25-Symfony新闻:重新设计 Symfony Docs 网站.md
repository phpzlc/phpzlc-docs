---
title: 新版SymfonyDoc设计实现方法
permalink: /blog/25.html
description_auto: 0
description: 新版SymfonyDoc设计实现方法
tags: phpzlc,symfony,开源社区
author_no: 1
img_all: 1
---

## 构建 Symfony Doc

Symfony 项目的文档是开源的，并使用[github.com/symfony/symfony-docs](github.com/symfony/symfony-docs)存储库进行管理 。来自世界各地的数千人为这些文档做出了贡献。它是整个开源领域最受欢迎的文档项目之一。

`Symfony Docs` 使用 `reStructuredText`（或简称 RST）格式来编写其内容。然后，我们使用`Sphinx`，一种文档构建工具，将这些 RST 文件转换为我们网站上提供的 HTML 内容。

这种设置多年来一直很好地为我们服务，但它给我们带来了一些严重的问题。首先，Sphinx 以及大部分与 RST 相关的工具都是用 Python 编程语言编写的，我们不太了解。其次，更新和维护Sphinx给我们带来了很多麻烦，因为它过于严格和无情。

这就是为什么在 2019 年左右我们开始认真寻找基于 PHP 的替代方案。

## 坚持 RST 格式

一个明显的解决方案是将 Symfony Docs 切换到 Markdown，这是最流行的文档格式。由于 Symfony Docs 的内容量巨大（将它们全部转换为 Markdown 将花费我们永远），这很快就被丢弃了。

在继续之前，让我们玩一个游戏：你能猜出整个 Symfony Docs 的大小（以行、词和字符为单位）吗？我会在这篇博文的最后告诉你答案。

除了内容大小之外，还有另一个问题。Markdown 适用于简单的内容，但不适用于复杂的技术文档。RST 提供了您在编写复杂文档时需要的所有功能，例如对内部文档部分的交叉引用和用于创建自定义内容块的可编程“指令”。在 Markdown 中，这是不可能的，或者您需要使用不属于标准的技巧。

用 PHP 构建 RST 解析器
构建一个文档解析器并不是一件简单的事，对于像 RST 这样的全功能格式来说更是如此。幸运的是，Symfony 并不是唯一需要 RST 解析器的 PHP 相关项目。Doctrine 项目也使用 RST 作为其文档，并且还想摆脱 Sphinx 来构建他们的文档。

这就是为什么一些 Doctrine 人 基于以前但不完整的 RST 解析器创建（并开源）了学说/rst-parser项目的原因。它不是一个完全兼容的 RST 解析器，但它超级快速、易于使用并且涵盖了我们所有的 RST 需求。

RST 解析器问题现已解决。接下来，我们需要创建一个完整的“文档构建器”来替换 Sphinx。

## 在 PHP 中创建文档生成器

由于 Doctrine 的 RST 解析器的灵活性，我们可以在它之上构建一个名为symfony-tools/doc-builder的应用程序。简而言之，这个工具找到 RST 文件，将它们解析为 HTML（包括代码突出显示），并将它们保存在具有 symfony.com 期望的特定结构的 JSON 文件中。

这个文档构建器还定义和处理所有在 Symfony Docs 中使用的自定义 RST 指令。例如，当您浏览Symfony 路由文章时，您可以选择某些代码块的格式（注释、属性、YAML、XML 等）。这不是 RST 标准的一部分，但与 Markdown 相反，在 RST 中有一个扩展格式的标准方法。

这就是 Symfony Docs 使用专有.. configuration-block:指令的原因，该指令在我们的文档构建器的ConfigurationBlockDirective 类中进行处理。

## 在 symfony.com 中更新 Doc Internals

用我们自己的 PHP Doc Builder 替换 Sphinx/Python 的所有必要部分都已准备就绪。最后一步是更新 symfony.com 代码以使用它。由于过去几年积累的“技术债务”，这比我们预期的要长一些。

幸运的是，我们进行了一些 PHPUnit 测试来检查文档是否按预期工作（例如预期的页面标题和目录、文档导航等）。这让我们在开始大规模重构之前有一些信心。

我们最终删除了大部分与 docs 相关的现有代码，并将其替换为一些从 doc builder 生成的 JSON 文件创建的 DTO。这些 DTO 包含完全呈现页面所需的所有数据（其目录项、内容的区域设置、发布页面的其他 Symfony 版本等）这帮助我们从控制器中删除了所有逻辑和模板。

Sphinx 和 Python 现在消失了。RST 解析器和 Doc Builder 已经完全集成在 symfony.com 中。接下来是什么？重新设计文档部分！

## 引用评论

本文中很多内容直接摘抄于[Symfony 新闻: 重新设计 Symfony Docs 网站](https://symfony.com/blog/redesigning-the-symfony-docs-website#building-symfony-docs).

摘抄部分是技术背景和技术实现部分，有很强的学习作用。

PHPZlc一直都在学习Symfony,之前为了实现Symfony Doc,开发了组件 md-bundle,看到这篇消息，又打开了新的大门，敬请期待。